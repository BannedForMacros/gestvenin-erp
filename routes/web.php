<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Configuracion\EmpresaController;
use App\Http\Controllers\Configuracion\LocalController;
use App\Http\Controllers\Configuracion\RoleController;
use App\Http\Controllers\Configuracion\RoleModuleController;
use App\Http\Controllers\Configuracion\UserModuleController;
use App\Http\Controllers\Configuracion\CategoriaAlmacenController;
use App\Http\Controllers\Configuracion\UnidadMedidaController;
use App\Http\Controllers\AlmacenCentral\ProductoAlmacenController;
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

                // Categorías Almacén
        Route::get('categorias-almacen', [CategoriaAlmacenController::class, 'index'])->name('categorias-almacen.index');
        Route::post('categorias-almacen', [CategoriaAlmacenController::class, 'store'])->name('categorias-almacen.store');
        Route::put('categorias-almacen/{id}', [CategoriaAlmacenController::class, 'update'])->name('categorias-almacen.update');
        Route::delete('categorias-almacen/{id}', [CategoriaAlmacenController::class, 'destroy'])->name('categorias-almacen.destroy');

        // Unidades de Medida
        Route::get('unidades-medida', [UnidadMedidaController::class, 'index'])->name('unidades-medida.index');
        Route::post('unidades-medida', [UnidadMedidaController::class, 'store'])->name('unidades-medida.store');
        Route::put('unidades-medida/{id}', [UnidadMedidaController::class, 'update'])->name('unidades-medida.update');
        Route::delete('unidades-medida/{id}', [UnidadMedidaController::class, 'destroy'])->name('unidades-medida.destroy');

    });

        // Almacén Central
    Route::prefix('almacen-central')->name('almacen-central.')->group(function () {
        
        // Productos
        Route::get('productos', [ProductoAlmacenController::class, 'index'])->name('productos.index');
        Route::post('productos', [ProductoAlmacenController::class, 'store'])->name('productos.store');
        Route::put('productos/{id}', [ProductoAlmacenController::class, 'update'])->name('productos.update');
        Route::delete('productos/{id}', [ProductoAlmacenController::class, 'destroy'])->name('productos.destroy');
    });
});

require __DIR__.'/auth.php';