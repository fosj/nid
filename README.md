# NID - Stand-In Datasets & Publication Storage Repository

NID is a lightweight stand-in for a currently being developed. This service
provides storage for datasets and publications using two Minio S3 object store.
Metadata for these storage entities form the S3 bucket name. This
implementations limits the volume and characters values that can be maintained
in the metadata.

Datasets repository can store the metadata values `id` and `name`, these are
limited to lowercase alphanumeric characters and hyphens (`-`). These enteries
have a 30 characters maximum length.

Publications repository can store the metadata vlues `user`, `workflowId` and
`executionTime`. The enteries `user` and `workflowId` are limited to lowercase
alphanumeric characters and hyphens (`-`) with a 24 character limit. The value
`executionTime` is expected as a ISO formatted date value.

## Endpoints

### Health Routes

```
# List possible routes
GET  /

# Response with the current environmental variables
GET  /health/info

# Health check for the service
GET  /health/readiness
```


### Datasets Routes

```
# List metadata for stored datasets
GET  /datasets

# Creates new repository with metadata
# REQ BODY - Expected properties: id, name
# RES HEADER - Path to created repository
POST /datasets
  REQ BODY - JSON
  RES HEADER Location

# List files within the repository
GET  /datasets/:entity

# Upload file to be to repository
# REQ BODY - File to be added (path and filename taken from route)
PUT  /datasets/:entity/  :path/:file -or- /:file
  REQ BODY - file

# Download file from repository
# RES BODY - Stream of object from repository (path and filename taken from route)
GET  /datasets/:entity/  :path/:file -or- /:file
  RES BODY - object content

# Delete file from repository (path and filename taken from route)
DEL /datasets/:entity/  :path/:file -or- /:file

# Delete repository and all object
DEL /datasets/:entity/
```


### Publication Routes

```
# List metadata for stored publications
GET  /publications

# Creates new repository with metadata
# REQ BODY - Expected properties: user, workflowId, executionTime
# RES HEADER - Path to created repository
POST /publications
  REQ BODY - JSON
  RES HEADER Location

# List files within the repository
GET  /publications/:entity

# Upload file to be to repository
# REQ BODY - File to be added (path and filename taken from route)
PUT  /publications/:entity/  :path/:file -or- /:file
  REQ BODY - file

# Download file from repository
# RES BODY - Stream of object from repository (path and filename taken from route)
GET  /publications/:entity/  :path/:file -or- /:file
  RES BODY - object content

# Delete file from repository (path and filename taken from route)
DEL /publications/:entity/  :path/:file -or- /:file

# Delete repository and all object
DEL /publications/:entity/
```

## Development

Docker-Compose files have been included to run NID as either stand-alone or in
watch mode. Running the command `docker-compose up` in the development directory
with build the NID and start two Minio instances in a working mode for direct
use for integration with other projects.

The watch mode will mount in the `src` directory into the the running container
this allows for the server to be restarted when code changes are detected. To
use this first Node 10 will need to be installed and `yarn install` run in the
root directory to retrieve the required libraries. Next docker-compose can be
started using
`docker-compose -f docker-compose.yml -f watch.docker-compose.yml up` this will
start the NID (in watch mode) and twi Minio instances.

An [Insomnia](https://insomnia.rest/) schema is include in the
`development/insomnia` directory, which is set up to use the defined routes.

Traefik is set up to act as a reverse proxy and should be configured to work to
the browser. Once docker-compose is started it can take up-to a minute to detect
the containers. Minio instances can be accessed via
`minio-datasets.docker.localhost` and `minio-publications.docker.localhost`, the
development access-key and secret-key are noted in the docker-compose file. NID
can also be accessed via the browser at `nid.docker.localhost`.
