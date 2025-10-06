# RestServerFull


## Complete implementation of a REST server using HttpServer from the JDK 

This project is an example implementation of a REST server.
The HttpServer from the JDK is used for HTTP parsing:
https://docs.oracle.com/en/java/javase/21/docs/api/jdk.httpserver/com/sun/net/httpserver/HttpServer.html

It implements the following endpoints:
- /echo ... a simple echo server, responding with an echo to the request body
- /weather ... a simple weather server, responding with the current weather for a given city

## Build and run
`mvn clean package`
`mvn exec:java`
or Click on the green button "Run" in IntelliJ IDEA

The Server URL is: http://localhost:10001/

To interact with the server, use the prepared HTTP requests in the file [rest-tests.http](rest-tests.http)

## Run the tests only
`mvn test`
or
Richt-Click in the Project tree on restserverfull/src/test/java/at/fhtw/" 
and select "Run 'tests in at.fhtw'" in the popup context-menu. 
