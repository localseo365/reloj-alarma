import { Application } from '@nativescript/core';
import { LocalNotifications } from '@nativescript/local-notifications';

// Initialize local notifications
LocalNotifications.requestPermission().then((granted) => {
    if (granted) {
        console.log('Permission granted for notifications');
    }
});

// Register entry components
Application.run({ moduleName: 'app-root' });