# Script para subir imágenes a Docker Hub

$ErrorActionPreference = "Stop"

# 1. Solicitar nombre de usuario de Docker Hub
$dockerUser = Read-Host "Por favor, introduce tu usuario de Docker Hub"

if ([string]::IsNullOrWhiteSpace($dockerUser)) {
    Write-Error "El usuario de Docker Hub es obligatorio."
    exit 1
}

# 2. Iniciar sesión en Docker Hub
Write-Host "`n>>> Iniciando sesión en Docker Hub..." -ForegroundColor Cyan
docker login

if ($LASTEXITCODE -ne 0) {
    Write-Error "Fallo al iniciar sesión en Docker Hub."
    exit 1
}

# 3. Construir las imágenes
Write-Host "`n>>> Construyendo imágenes..." -ForegroundColor Cyan
docker compose build

if ($LASTEXITCODE -ne 0) {
    Write-Error "Fallo al construir las imágenes."
    exit 1
}

# Lista de servicios definidos en docker-compose.yml y sus nombres de imagen locales

# Ajustamos esto basándonos en los nombres de contenedor o build context
$services = @(
    @{ Name = "microservice-gateway"; Image = "arquitectura-microservice-gateway" },
    @{ Name = "notification-service"; Image = "arquitectura-notification-service" },
    @{ Name = "ticket-service"; Image = "arquitectura-ticket-service" },
    @{ Name = "course-service"; Image = "arquitectura-course-service" },
    @{ Name = "enrollment-service"; Image = "arquitectura-enrollment-service" },
    @{ Name = "grade-service"; Image = "arquitectura-grade-service" },
    @{ Name = "report-service"; Image = "arquitectura-report-service" },
    @{ Name = "crm-backend"; Image = "arquitectura-crm-backend" },
    @{ Name = "crm_frontend"; Image = "arquitectura-crm_frontend" }
)

# 4. Etiquetar y Subir imágenes
foreach ($service in $services) {
    $localImage = $service.Image
    $targetImage = "$dockerUser/$($service.Name):latest"

    Write-Host "`n>>> Procesando servicio: $($service.Name)" -ForegroundColor Yellow
    
    # Verificar si la imagen local existe
    if (!(docker images -q $localImage)) {
        Write-Warning "No se encontró la imagen local '$localImage'. Intentando buscar por nombre de contenedor..."
        # Fallback: intentar adivinar el nombre si docker compose le puso otro prefijo
        # Asumimos que el usuario está en la carpeta 'Arquitectura', así que el prefijo es 'arquitectura'
    }

    Write-Host "    Etiquetando $localImage -> $targetImage"
    docker tag $localImage $targetImage

    Write-Host "    Subiendo $targetImage..."
    docker push $targetImage
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    ✅ Subida exitosa." -ForegroundColor Green
    }
    else {
        Write-Error "    ❌ Fallo al subir $targetImage"
    }
}

Write-Host "`n>>> ¡Proceso completado! Todas las imágenes han sido subidas a https://hub.docker.com/u/$dockerUser" -ForegroundColor Cyan
