# PowerShell script to start AirLink microservices locally without Docker
param(
    [string]$Service = "all"
)

$rootDir = $PSScriptRoot
$logsDir = Join-Path $rootDir "logs"
if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir | Out-Null
}

$allServices = @(
    @{ Name = "service-registry"; Path = "cloud/service-registry"; Port = 8761 },
    @{ Name = "api-gateway"; Path = "cloud/api-gateway"; Port = 9000 },
    @{ Name = "user-service"; Path = "services/user-service"; Port = 8002 },
    @{ Name = "location-service"; Path = "services/location-service"; Port = 8001 },
    @{ Name = "airline-core-service"; Path = "services/airline-core-service"; Port = 8003 },
    @{ Name = "flight-ops-service"; Path = "services/flight-ops-service"; Port = 8004 },
    @{ Name = "pricing-service"; Path = "services/pricing-service"; Port = 8005 },
    @{ Name = "seat-service"; Path = "services/seat-service"; Port = 8006 },
    @{ Name = "ancillary-service"; Path = "services/ancillary-service"; Port = 8007 },
    @{ Name = "booking-service"; Path = "services/booking-service"; Port = 8008 },
    @{ Name = "payment-service"; Path = "services/payment-service"; Port = 8009 }
)

function Test-PortListening($port) {
    $conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    return ($null -ne $conn)
}

function Start-Microservice($svc) {
    if (Test-PortListening $svc.Port) {
        Write-Host "Service $($svc.Name) is already running on port $($svc.Port)." -ForegroundColor Yellow
        return
    }

    Write-Host "Starting $($svc.Name) on port $($svc.Port)..." -ForegroundColor Cyan
    $logFile = Join-Path $logsDir "$($svc.Name).log"
    
    $jvmArgs = "-Dspring-boot.run.jvmArguments=-Xms128m -Xmx256m"
    $mvnCmd = "mvn -pl $($svc.Path) spring-boot:run `"$jvmArgs`""
    
    Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile -Command `"$mvnCmd *>&1 | Tee-Object -FilePath '$logFile'`"" -WindowStyle Hidden
}

# 1. Check MySQL
Write-Host "=== Checking Prerequisites ===" -ForegroundColor Cyan
$mysqlConn = Get-NetTCPConnection -LocalPort 3306 -State Listen -ErrorAction SilentlyContinue
if (-not $mysqlConn) {
    Write-Host "WARNING: MySQL does not appear to be listening on port 3306! Please make sure MySQL is started." -ForegroundColor Red
} else {
    Write-Host "MySQL is running on port 3306." -ForegroundColor Green
}

# 2. Check/Install common-lib
Write-Host "`nEnsuring common-lib is compiled and installed..." -ForegroundColor Cyan
Push-Location $rootDir
mvn -pl common-lib install -DskipTests -q
Pop-Location

# 3. Start requested services
if ($Service -eq "all") {
    Write-Host "`n=== Starting Service Registry (Eureka) ===" -ForegroundColor Cyan
    $eureka = $allServices | Where-Object { $_.Name -eq "service-registry" }
    Start-Microservice $eureka

    # Wait for Eureka to be up
    Write-Host "Waiting for Service Registry on port 8761..." -ForegroundColor Yellow
    $retries = 0
    while (-not (Test-PortListening 8761) -and $retries -lt 30) {
        Start-Sleep -Seconds 2
        $retries++
    }

    if (Test-PortListening 8761) {
        Write-Host "Service Registry is UP!" -ForegroundColor Green
    } else {
        Write-Host "Service Registry did not start in time. Check logs/service-registry.log" -ForegroundColor Red
    }

    Write-Host "`n=== Starting API Gateway and Business Services ===" -ForegroundColor Cyan
    foreach ($svc in $allServices) {
        if ($svc.Name -ne "service-registry") {
            Start-Microservice $svc
            Start-Sleep -Seconds 2
        }
    }

    Write-Host "`nAll service startup commands dispatched!" -ForegroundColor Green
    Write-Host "Logs are being written to the 'logs/' folder." -ForegroundColor Yellow
    Write-Host "Run .\status-backend.ps1 to verify the status." -ForegroundColor Yellow
} else {
    $target = $allServices | Where-Object { $_.Name -like "*$Service*" }
    if ($target) {
        foreach ($t in $target) {
            Start-Microservice $t
        }
    } else {
        Write-Host "Service '$Service' not found. Available services:" -ForegroundColor Red
        $allServices | ForEach-Object { Write-Host " - $($_.Name)" }
    }
}
