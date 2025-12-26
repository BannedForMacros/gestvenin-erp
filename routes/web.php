<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Configuracion\EmpresaController;
use App\Http\Controllers\Configuracion\LocalController;
use App\Http\Controllers\Configuracion\RoleController;
use App\Http\Controllers\Configuracion\RoleModuleController;
use App\Http\Controllers\Configuracion\UserModuleController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Ruta de bienvenida
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Rutas autenticadas
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Usuarios


    // Configuración
    Route::prefix('configuracion')->name('configuracion.')->group(function () {
        
        // Empresas
        Route::resource('empresa', EmpresaController::class);
        
        // Locales
        Route::resource('locales', LocalController::class)->parameters([
            'locales' => 'local'
        ]);
        
        // Roles
        Route::resource('roles', RoleController::class)->parameters([
            'roles' => 'role'
        ]);

        //Usuarios
        Route::resource('usuarios', UserController::class)->parameters([
            'usuarios' => 'usuario'
        ]);
        
        // Permisos por Rol
        Route::get('permisos-rol', [RoleModuleController::class, 'index'])->name('permisos-rol.index');
        Route::get('permisos-rol/{role}', [RoleModuleController::class, 'show'])->name('permisos-rol.show');
        Route::put('permisos-rol/{role}', [RoleModuleController::class, 'update'])->name('permisos-rol.update');
        
        // Permisos por Usuario
        Route::get('permisos-usuario', [UserModuleController::class, 'index'])->name('permisos-usuario.index');
        Route::get('permisos-usuario/{user}', [UserModuleController::class, 'show'])->name('permisos-usuario.show');
        Route::put('permisos-usuario/{user}', [UserModuleController::class, 'update'])->name('permisos-usuario.update');
    });
});

require __DIR__.'/auth.php';