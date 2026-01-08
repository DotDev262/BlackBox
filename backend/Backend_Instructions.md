Instructions to run the backend

1. Building a docker 
```docker build -t fastapi-route-app .```

2. Running the docker container
```docker run -d -p 8000:8000 fastapi-route-app```

3. The container will be up in
```http://127.0.0.1:8000/```

```http://127.0.0.1:8000/route?source=NewYork&destination=Tokyo```
