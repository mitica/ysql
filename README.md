
# YSQL

YSQL is a language based on YAML or JSON that converts to SQL.

## Usage

```
var Query = require('ysql').Query;
var query = new Query();

var ysql = fs.readFileSync('format.yml', 'utf8');

query.parse(ysql).toSql();
// output: { text: 'SELECT id, name AS "title" FROM "docs"', params: [] }
```

Where file `format.yml` content is:

```
SELECT:
  COLUMNS:
    - COLUMN:
        name: id
    - COLUMN:
        name: name
        as: title
  FROM:
    TABLE:
      name: docs
```

[![Build Status](https://secure.travis-ci.org/Mitica/ysql.png)](http://travis-ci.org/Mitica/ysql)

