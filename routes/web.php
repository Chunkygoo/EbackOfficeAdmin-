<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
// use App\Http\Controllers\CustomerController;
use App\Http\Controllers\UtilitiesController;
use App\Http\Controllers\AvailableTaskController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\TaskListController;
use App\Http\Controllers\MyTaskController;
use App\Http\Controllers\EventController;

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
    // Route::get('/welcome', function () {
    //     return view('welcome');
    // });
    // Route::resource("customers", CustomerController::class);
    // Route::post("customers/deleteMany",  [CustomerController::class, 'destroyMany'])->name('customers.destroyMany');

    Route::put("users/readAnnouncement/{announcementId}",  [UserController::class, 'readAnnouncement'])->name('users.readAnnouncement');
    Route::put("users/unreadAnnouncement/{announcementId}",  [UserController::class, 'unreadAnnouncement'])->name('users.unreadAnnouncement');
    Route::put("users/deleteAnnouncement/{announcementId}",  [UserController::class, 'deleteAnnouncement'])->name('users.deleteAnnouncement');
    Route::put("users/deleteAnnouncements",  [UserController::class, 'deleteAnnouncements'])->name('users.deleteAnnouncements');
    Route::get("users/populateUsersForTaskList",  [UserController::class, 'populateUsersForTaskList'])->name('users.populateUsersForTaskList');
    Route::post("users/deleteMany",  [UserController::class, 'destroyMany'])->name('users.destroyMany');
    Route::resource("users", UserController::class);

    Route::get("availableTasks/populateAvalableTasksForTaskList",  [AvailableTaskController::class, 'populateAvalableTasksForTaskList'])->name('availableTasks.populateAvalableTasksForTaskList');
    Route::post("availableTasks/deleteMany",  [AvailableTaskController::class, 'destroyMany'])->name('availableTasks.destroyMany');
    Route::resource("availableTasks", AvailableTaskController::class);

    Route::post("announcements/deleteMany",  [AnnouncementController::class, 'destroyMany'])->name('announcements.destroyMany');
    Route::resource("announcements", AnnouncementController::class);


    Route::post("taskLists/deleteMany",  [TaskListController::class, 'destroyMany'])->name('taskLists.destroyMany');
    Route::resource("taskLists", TaskListController::class);

    Route::resource("myTasks", MyTaskController::class);

    Route::resource('events', EventController::class);
});

Route::get('/token', [UtilitiesController::class, 'token']);
Route::get('/getLoggedInUsername', [UtilitiesController::class, 'getLoggedInUsername']);
