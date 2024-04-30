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

let searchParameters = {
    q: "Chinese",
    query_by: "Title",
    // sort_by: "ratings_count:desc",
};

client
    .collections("books")
    .documents()
    .search(searchParameters)
    .then(function (searchResults) {
        console.log(searchResults);
    });
