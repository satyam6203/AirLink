# PowerShell script to stop all running backend microservices
$ports = @(8761, 9000, 8001, 8002, 8003, 8004, 8005, 8006, 8007, 8008, 8009)

Write-Host "Stopping AirLink microservices..." -ForegroundColor Yellow

$stopped = 0
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    foreach ($conn in $connections) {
        $procId = $conn.OwningProcess
        if ($procId -and $procId -ne 0) {
            try {
                $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
                if ($proc) {
                    Write-Host "Killing process $($proc.ProcessName) (PID: $procId) on port $port..." -ForegroundColor Cyan
                    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
                    $stopped++
                }
            } catch {
                # Ignore process already stopped
            }
        }
    }
}

Write-Host "Done. Stopped $stopped service process(es)." -ForegroundColor Green
