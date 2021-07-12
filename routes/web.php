<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\UtilitiesController;
use App\Http\Controllers\AvailableTaskController;
use App\Http\Controllers\TaskListController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Auth::routes();
Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::group(['middleware' => ['auth']], function () {
    Route::get('/', function () {
        return view('reactApp');
    });
    Route::resource("customers", CustomerController::class);
    Route::post("customers/deleteMany",  [CustomerController::class, 'destroyMany'])->name('customers.destroyMany');
    Route::resource("users", UserController::class);
    Route::resource("availableTasks", AvailableTaskController::class);
    Route::post("availableTasks/deleteMany",  [AvailableTaskController::class, 'destroyMany'])->name('availableTasks.destroyMany');
    Route::resource("taskLists", TaskListController::class);
    Route::post("taskLists/deleteMany",  [TaskListController::class, 'destroyMany'])->name('taskLists.destroyMany');
});

Route::get('/token', [UtilitiesController::class, 'token']);
Route::get('/getLoggedInUsername', [UtilitiesController::class, 'getLoggedInUsername']);
