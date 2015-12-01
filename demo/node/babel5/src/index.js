/**
 * @file es6-babel5
 * @author xx
 */

'use strict';

class Es6 {
    static options = {
        test: 1
    }

    constructor() {
        console.log(this.options, Es6.options);
    }
}

let app = new Es6();