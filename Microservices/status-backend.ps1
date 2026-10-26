# PowerShell script to check status of all local microservices
$services = @(
    @{ Name = "service-registry"; Port = 8761; Role = "Eureka Server" },
    @{ Name = "api-gateway"; Port = 9000; Role = "API Gateway" },
    @{ Name = "location-service"; Port = 8001; Role = "Business Service" },
    @{ Name = "user-service"; Port = 8002; Role = "Business Service" },
    @{ Name = "airline-core-service"; Port = 8003; Role = "Business Service" },
    @{ Name = "flight-ops-service"; Port = 8004; Role = "Business Service" },
    @{ Name = "pricing-service"; Port = 8005; Role = "Business Service" },
    @{ Name = "seat-service"; Port = 8006; Role = "Business Service" },
    @{ Name = "ancillary-service"; Port = 8007; Role = "Business Service" },
    @{ Name = "booking-service"; Port = 8008; Role = "Business Service" },
    @{ Name = "payment-service"; Port = 8009; Role = "Business Service" }
)

Write-Host "`n=== AirLink Microservices Local Status ===" -ForegroundColor Cyan

$results = foreach ($svc in $services) {
    $conn = Get-NetTCPConnection -LocalPort $svc.Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
    $isUp = $null -ne $conn
    [PSCustomObject]@{
        Service = $svc.Name
        Role    = $svc.Role
        Port    = $svc.Port
        Status  = if ($isUp) { "RUNNING" } else { "STOPPED" }
        PID     = if ($isUp) { $conn.OwningProcess } else { "-" }
    }
}

$results | Format-Table -AutoSize

# Check Eureka registration count if Eureka is up
try {
    $eureka = Invoke-RestMethod -Uri "http://localhost:8761/eureka/apps" -Headers @{ "Accept" = "application/json" } -TimeoutSec 2 -ErrorAction Stop
    $registered = $eureka.applications.application.name
    Write-Host "`nRegistered with Eureka ($($registered.Count) services):" -ForegroundColor Green
    $registered | ForEach-Object { Write-Host " - $_" -ForegroundColor Green }
} catch {
    Write-Host "`nEureka is not reachable or responding yet." -ForegroundColor Yellow
}
