const Typesense = require("typesense");

let client = new Typesense.Client({
    nodes: [
        {
            host: "localhost", // For Typesense Cloud use xxx.a1.typesense.net
            port: 8108, // For Typesense Cloud use 443
            protocol: "http", // For Typesense Cloud use https
        },
    ],
    apiKey: "xyz",
    connectionTimeoutSeconds: 2,
});

let booksSchema = {
    name: "books",
    fields: [
        { name: "Title", type: "string" },
        { name: "Subtitle", type: "string" },
        { name: "Authors", type: "string" },
        { name: "Categories", type: "string", facet: true },
        { name: "Published At", type: "int32", facet: true },
        { name: "Page Count", type: "int32" },
        { name: "Description", type: "string" },
        { name: "Publisher", type: "string" },
    ],
    // default_sorting_field: "Title",
};

client
    .collections()
    .create(booksSchema)
    .then(function (data) {
        console.log(data);
    });

var fs = require("fs/promises");

async function loadBooksData() {
    const booksInJsonl = await fs.readFile("output.json");
    client.collections("books").documents().import(booksInJsonl);
}
loadBooksData();
