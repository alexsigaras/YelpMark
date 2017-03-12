# YelpMark

YelpMark is a Yelp bookmark enhancing web application that enables users to tag and save businesses discovered through the Yelp API. Users are able to see ratings, reviews, business information, and retrieve driving directions to the business. With YelpMark users can search via voice or simple text input. Yelpmark supports geolocation, helping users find local results faster. Users can filter both bookmarks and search results by rating, user defined tag, and category.

![](docs/images/yelpmark.png)

## Documentation

- [Proposed Design Concept](docs/Proposed%20Design%20Concept.pdf)
- [YelpMark Development](docs/YelpMark%20Development%20Updated.docx)
- [Designs](docs/designs.md)

## Running YelpMark using docker

### Template

```bash
docker run -d --name yelpmark \
--restart=always \
-p {PORT}:80 \
-v '{PATH/TO/public-html}':/usr/local/apache2/htdocs/ \
httpd:2.4
```

### Where:
- **{PATH/TO/public-html}**: The location where public-html files are stored.
- **{PORT}**: The external port you want to expose YelpMark.

### Example

```bash
docker run -d --name yelpmark \
--restart=always \
-p 8081:80 \
-v '$PWD'/public-html:/usr/local/apache2/htdocs/ \
httpd:2.4
```