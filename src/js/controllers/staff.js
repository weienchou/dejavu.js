export class Staff {
    constructor() {
    }

    list(path) {
        console.log(this, ' <-- MEMBER')

        this.view.load('staff/list');
    	// djv.log('Home::index')
    }
}