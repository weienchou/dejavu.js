export class Dropdown {
    constructor() {

    }

    click(ta) {
        const target = ta.data('target');

        ta.toggleClass('is-active');
        f('#' + target).toggleClass("is-active");
    }
}