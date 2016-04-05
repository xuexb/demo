var mock = require('mock-fs');

mock({
    'file.txt': 'file content here'
});

mock({
    test: {
        'a.spec': '',
        'b.spec': '',
        'c.spec': '',
        'foo.spec': '',
        'bar.spec': '',
        'baz.x': ''
    }
});
