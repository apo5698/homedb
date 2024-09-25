# HomeDB

HomeDB is a web application that allows users to manage their home data.

## Get Started

Create a `docker-compose.yml` file with the following content:

```yaml
services:
  homedb:
    image: apo5698/homedb
    container_name: homedb
    restart: unless-stopped
    ports:
      - "<your_port>:3000"
    environment:
      DATABASE_URL: <your_database_url>
```

## Development

### Installation

Clone the repository and install dependencies:

```shell
git clone https://github.com/apo5698/homedb.git
cd homedb
npm install
```

To start the development server:

```shell
npm run dev
```

Go to http://localhost:3000. The app will automatically reload if you make changes to the code.
