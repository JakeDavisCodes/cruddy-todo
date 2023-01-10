const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};
const dir = './test/testData/';

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  /** GOALS
   *
   * use the unique ID to create a new file in dataDir
   * save the text in this file
   *
   *
   * PSUEDO
   * I: Text
   * O: calls callback with err, dataObject
   *
   * let id = counter.getNextUniqueId
   * fs.writeFile(dataDirr:id, text, (err, data) => {
   *  console.log(data)      I wanna see what data is
   *  callback(err, data)
   * }))     // Doc: https://www.geeksforgeeks.org/node-js-fs-writefile-method/ ?? unsure if dataObject should be string
   *
   */

  counter.getNextUniqueId((err, num) => {
    if (err) {
      console.error('ERROR OCCURED: ', err);
    } else {
      fs.writeFile(dir + num + '.txt', text, () => {
        callback(null, {id: num, text: text});
      });
    }
  });

  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {

  /** GOALS
   *
   * create an array of the objects
   *  objects should be formated as such for now:
   *    {id: id, text: id}
   * do NOT attempt to read file text, that is for later
   *
   * Psuedo
   * I: callback
   * O: calls callback with err, data
   *
   *
   * fs.readdir(/dataDir, (err, files) => {           // Doc: https://medium.com/stackfame/get-list-of-all-files-in-a-directory-in-node-js-befd31677ec5
   *  handle err
   *  data = []
   *  files.forEach( file => data.push(file) )
   *  callback(null, data)                         at this point, im not sure what data contains. Files are likely the path... in which case, we could read the id from the path. it might look like this, '/dataDir:id' in which case we could use file.substring()   to push
   * })                                           specifically the ID
   *
   */

  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error('ERROR OCCURED AT READALL: ', err);
    } else {
      data = [];
      files.forEach(file => {
        data.push({id: file.substring(0, 5), text: file.substring(0, 5)});
      });
      callback(null, data);
    }
  });


};

exports.readOne = (id, callback) => {
  // debugger
  fs.readFile(dir + id + '.txt', 'utf8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`), '');
    } else {
      callback(null, { id: id, text: data});
    }
  });

  /** GOALS
   *
   * read a file in the dataDir by it's ID
   * read the file's text
   * respond with text
   *
   * Psuedo
   *
   * I: an ID
   * O: calls callback with err, text
   *
   * fs.readFile(dataDir:id, (err, text) => callback(err, text))        Not sure, but this might be all that is neccessary   ?? Do we need to include a case where ID doesnt exist like below? or does readFile handle that
   */



};

exports.update = (id, text, callback) => {

  /** GOALS
   *
   * Write to dataDir:id with new text
   *
   * Psuedo
   * I: id, updatedText, callback
   * O: calls callback with err, dataObject
   *
   *
   *
   * fs.writeFile(dataDir:id, text, (err, data) => {                  // Doc: https://www.geeksforgeeks.org/node-js-fs-writefile-method/
   *  callback(err, data)
   * })
   */
  fs.access(dir + id + '.txt', (err) => {
    if (err) {
      callback(new Error ('No such file exists'));
    } else {
      fs.writeFile(dir + id + '.txt', text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, {id: id, text: text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(dir + id + '.txt', (err) => {
    if (err) {
      callback(new Error('Failed - No such file'));
    } else {
      callback();
    }
  });


};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
