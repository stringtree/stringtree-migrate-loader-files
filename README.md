# stringtree-migrate-loader-files

A helper to load migration scripts from a filesystem for [Stringtree Migrate](https://github.com/stringtree/stringtree-migrate), the simple, flexible, database-independent way to manage automated schema updates

## Installation

    $ npm install stringtree-migrate-loader-files

## Usage Example:
```js
 var config = {
   host: 'localhost', port: 3306,
   database: 'test', user: 'uu', password: 'pp'
 };
 var driver = require('stringtree-migrate-driver-mysql')(config);

 var loader = require('stringtree-migrate-loader-files'); 

 loader.load('/some/path', function(err, scripts) {
   if (err) throw(err);

   var migrate = require('stringtree-migrate')(driver, scripts);

   // ensure database has had all available updates applied
   migrate.ensure(function(err, level) {
     .. code that needs the db ..
   });
 });
```
### Example File Structure

    /some/path
      1
        create-ugh.ddl
      23
        001-add-33.sql
        002-add-44.sql

Some important things to note about this are:

* Each directory under the specified path represents a _level_. These have numeric names so that there can be a completely unambiguous order in which to process them. If the loader finds any non-numeric subdirectories it will abort with an error.
* Each _level_ may contain as many files as you like. All files will be processed.
* Scripts within a level may have any name and/or extension, and will be processed in '[default sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)' order (i.e. alphabetic according to unicode code point). To avoid confusion, it is generally recommended that scripts within a level should not be order dependent, but where they are, they should have a clear and explicit sort order.

## What _stringtree-migrate-loader-files_ does

[Stringtree Migrate](https://github.com/stringtree/stringtree-migrate) does not specify how or where update scripts are stored, merely that they should be passed in to the api in a particular array structure. For simple cases embedding the update scripts direct in the source code is enough, but when the scripts get a bit more complicated, particularly when they need multiple lines per script, it can be easier to manage them as files.

That's where this module comes in. It reads files from a simple but rigorous directory structure and builds an appropriate in-memory array for passing to Stringtree Migrate.

## What _stringtree-migrate-loader-files_ does not do

This module is deliberately simple. It does not try to be smart about file types, but just grabs every file in the directory structure. It does not mess with the contents of the files, just loads them as utf8, and stores each complete file as a script in the array.

One upshot of this is that he contents of the script files must be exactly as required by the Stringtree Migrate database driver you are using. If your driver can't handle comments or blank lines, don't use them. If you driver needs a semicolon at the end of each line, make sure your files include semicolons. etc. 

### Configuration

stringtree-migrate-loader-files does not need any configuration, other than placing your script files in the correct directory structure.

## Related resources

* https://github.com/stringtree/stringtree-migrate
