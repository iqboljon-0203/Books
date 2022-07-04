const http = require('http');
const fs = require('fs');
const path = require('path');


function readData() {
    const rawData = fs.readFileSync('data.json')
    const data = JSON.parse(rawData);
    const massiv = data.books; // massiv;
    return massiv;
};

function upDateJson(massiv) {
    let newData = {
        books: massiv
    }

    newData = JSON.stringify(newData);
    fs.writeFileSync('data.json', newData);
};

const server = http.createServer((request, response) => {
    if (request.method == 'GET') {
        if (request.url == '/') {
            const indexFile = fs.readFileSync(__dirname + '/public/index.html');
            response.write(indexFile);
            response.end();
        } else if (request.url == '/books') {
            let books = fs.readFileSync('data.json');
            books = JSON.parse(books);
            books = JSON.stringify(books);
            response.end(books);
        }
    } else if (request.method == 'POST') {
        if (request.url == '/books') {
            let body = '';

            request.on('data', chunk => {
                body += chunk;
            });

            request.on('end', () => {
                let newBook = JSON.parse(body);
                let massiv = readData();

                massiv.push(newBook);
                for (let i = 0; i < massiv.length; i++) {
                    massiv[i].id = i;
                }

                upDateJson(massiv);

                response.end();
                console.log('Book added')
            });
        } else if (request.url == '/getbook'){
            let body = '';

            request.on('data', chunk => {
                body += chunk;
            });

            request.on('end', () => {
                let data = JSON.parse(body);
                let id = data.id;
        
                const massiv = readData();

                let book = {
                    name: massiv[id].name,
                    autor: massiv[id].autor
                };
                book = JSON.stringify(book);

                response.write(book);
                response.end();
                
            });
        }
    } else if (request.method == 'PUT') {
        if (request.url == '/books') {
            let body = '';

            request.on('data', chunk => {
                body += chunk;
            });

            request.on('end', () => {
                let upDatedBook = JSON.parse(body);
                let id = upDatedBook.id;

                let massiv = readData();

                massiv[id].name = upDatedBook.name;
                massiv[id].autor = upDatedBook.autor;

                upDateJson(massiv);

                response.end();

            });
        }
    };
}
).listen(3000);

console.log('\nServer running at localhost:3000 ...\n');