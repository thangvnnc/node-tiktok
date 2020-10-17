'use strict';
var MysqlException = require('../database/base/mysql-exception');
var MysqlExtension = require('../database/base/mysql-extension');
class Base extends MysqlExtension{
    constructor(row) {
        super();
        for(var propertyName in row) {
            // propertyName is what you want
            // you can get the value like this: myObject[propertyName]
            this[propertyName] = row[propertyName];
        }
    }
    printObjectInfo() {
        for(var propertyName in this) {
            console.log(propertyName + ":" + this[propertyName]);
        }
    }
    printPropertyNames() {
        for(var propertyName in this) {
            console.log(propertyName);
        }
    }
    printPropertyValues() {
        for(var propertyName in this) {
            console.log(this[propertyName]);
        }
    }
}
Base.perPage = 10;
class Pagination {
    constructor(path, nextPageUrl, prevPageUrl, perPage, currentPage, totalPage, data) {
        this.path = path;
        this.nextPageUrl = nextPageUrl;
        this.prevPageUrl = prevPageUrl;
        this.perPage = perPage;
        this.currentPage = currentPage;
        this.totalPage = totalPage;
        this.data = data;
    }

    links() {
        var htmlPagination = '';
        htmlPagination += '<ul class="pagination">\n';
        if (this.currentPage === 1) {
            htmlPagination += '<li class="disabled"><span>«</span></li>\n';
        }
        else {
            htmlPagination += '<li><a href="' + this.prevPageUrl + '"><span>«</span></a></li>\n';
        }

        for (let idxPage = 1; idxPage <= this.totalPage; idxPage++) {
            if (idxPage === this.currentPage) {
                htmlPagination += '<li class="active"><span>' + idxPage + '</span></li>\n';
            }
            else {
                htmlPagination += '<li><a href="' + this.path + '?page=' + idxPage + '">' + idxPage + '</a></li>\n';
            }
        }

        if (this.currentPage === this.totalPage) {
            htmlPagination += '<li class="disabled"><span>»</span></li>\n';
        }
        else {
            htmlPagination += '<li><a href="' + this.nextPageUrl + '"><span>»</span></a></li>\n';
        }
        htmlPagination += '</ul>';
        return htmlPagination;
    }
}
Base.Pagination = Pagination;

Base.query = function(sql, params, TypeObjectParse = null) {
    var pool = this.getInstance();
    return new Promise(function (resolve, reject) {
        pool.query(sql, params, function (error, results) {
            if (error) {
                reject(new MysqlException(error));
                return;
            }

            if (TypeObjectParse !== null) {
                var arrResult = [];
                results.forEach(result => {
                    let object = new TypeObjectParse(result);
                    arrResult.push(object);
                });

                resolve(arrResult);
            }
            resolve(results);
        });
    })
}

Base.execute = function(sql, params) {
    var pool = this.getInstance();
    return new Promise(function (resolve, reject) {
        pool.query(sql, params, function (error, results) {
            if (error) {
                reject(new MysqlException(error));
                return;
            }

            resolve(results);
        });
    })
}

Base.TypeSort = {
    ASC: "ASC",
    DESC: "DESC"
}

Base.getTopOrderColumn = function(BaseModel, columnOrderBy = null, typeSort = Base.TypeSort.ASC, numberRow = 1) {
    var pool = this.getInstance();
    var tableName = BaseModel.tableName;
    return new Promise(function (resolve, reject) {
        var orderBy = columnOrderBy ? columnOrderBy : null;
        var sqlQuery = "SELECT * FROM " + tableName;
        if (orderBy !== null) {
            sqlQuery += " ORDER BY " + orderBy;
            sqlQuery += " " + typeSort;
        }
        sqlQuery += " LIMIT 0," + numberRow;
        pool.query(sqlQuery, [], function (error, results) {
            if (error) {
                reject(new MysqlException(error));
                return;
            }

            var arrResult = [];
            results.forEach(result => {
                let object = new BaseModel(result);
                arrResult.push(object);
            });

            resolve(arrResult);
        });
    })
}

Base.getTotalPage = function(BaseModel, columnOrderBy, perPage) {
    return new Promise((resolve, reject) => {
        Base.getNumberRow(BaseModel, columnOrderBy)
            .then(numberRow => {
                resolve(Math.ceil(numberRow/perPage));
            })
            .catch(error => {
                reject(error);
            })
    });
}

Base.getNumberRow = function(BaseModel, columnOrderBy) {
    var pool = this.getInstance();
    var tableName = BaseModel.tableName;
    return new Promise(function (resolve, reject) {
        var sqlQuery = "SELECT COUNT(" + columnOrderBy + ") as numberRow FROM " + tableName;
        pool.query(sqlQuery, [], function (error, results) {
            if (error) {
                reject(new MysqlException(error));
                return;
            }
            resolve(results[0]['numberRow']);
        });
    })
}

Base.getDataPaginate = function(BaseModel, columnOrderBy, perPage, page, typeSort = Base.TypeSort.ASC) {
    var pool = this.getInstance();
    var tableName = BaseModel.tableName;
    return new Promise(function (resolve, reject) {
        var orderBy = columnOrderBy ? columnOrderBy : null;
        var sqlQuery = "SELECT * FROM " + tableName;
        if (orderBy !== null) {
            sqlQuery += " ORDER BY (" + orderBy + ")";
            sqlQuery += " " + typeSort;
        }
        var indexGet = perPage * (page - 1);
        sqlQuery += " LIMIT " + indexGet + "," + perPage;
        pool.query(sqlQuery, [], function (error, results) {
            if (error) {
                reject(new MysqlException(error));
                return;
            }

            var arrResult = [];
            results.forEach(result => {
                let object = new BaseModel(result);
                arrResult.push(object);
            });

            resolve(arrResult);
        });
    })
}

Base.paginate = function(req, columnOrderBy, perPage = 10, page = 1, typeSort = Base.TypeSort.ASC) {
    var path = req.protocol + '://' + req.get('host') + req.baseUrl;

    var promisePaginates = [
        Base.getTotalPage(this, columnOrderBy, perPage),
        Base.getDataPaginate(this, columnOrderBy, perPage, page, typeSort),
    ];

    return new Promise((resolve, reject) => {
        Promise.all(promisePaginates).then(values => {
            var nextPageUrl = null;
            var prevPageUrl = null;
            var totalPage = values[0];
            var data = values[1];

            if (page < totalPage) {
                nextPageUrl = path + "?page=" + (page + 1);
            }

            if (page > 1) {
                prevPageUrl = path + "?page=" + (page - 1);
            }

            var resultPaginate = new Base.Pagination(path, nextPageUrl, prevPageUrl, perPage, page, totalPage, data)
            resolve(resultPaginate);
        }).catch(error => reject(error));
    })
}
module.exports = Base;