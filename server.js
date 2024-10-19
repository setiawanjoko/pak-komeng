const http = require("http");
const fs = require("fs");

const host = "localhost";
const port = 5000;

const requestListener = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { method, url } = req;

  if (url == "/farmers") {
    if (method == "GET") {
      fs.readFile("./data.json", (err, data) => {
        let { farmers } = JSON.parse(data);
        res.end(
          JSON.stringify({
            status: "success",
            message: "Retrieved farmers",
            data: farmers,
          })
        );
      });
    } else if (method == "POST") {
      const timeNow = Date.now();
      let body = [];

      req.on("data", (chunk) => {
        body.push(chunk);
      });

      req.on("end", () => {
        body = Buffer.concat(body).toString();
        const reqData = JSON.parse(body);

        const farmer = {
          id: `farmer-${timeNow}`,
          ...reqData,
        };

        fs.readFile("./data.json", (err, data) => {
          data = JSON.parse(data);

          data.farmers.push(farmer);

          fs.writeFile("./data.json", JSON.stringify(data), "utf-8", (err) => {
            if (err) {
              console.log(`Failed to write to file: ${err}`);
            }
          });

          res.end(
            JSON.stringify({
              status: "success",
              message: "Add farmer success",
              data: farmer,
            })
          );
        });
      });
    } else {
      res.end(
        JSON.stringify({
          status: "fail",
          message: "You are not allowed to access this endpoint.",
        })
      );
    }
  } else if (url == "/commodities") {
    if (method == "GET") {
      fs.readFile("./data.json", (err, data) => {
        let { commodities } = JSON.parse(data);
        res.end(
          JSON.stringify({
            status: "success",
            message: "Retrieved commodities",
            data: commodities,
          })
        );
      });
    } else if (method == "POST") {
      const timeNow = Date.now();
      let body = [];

      req.on("data", (chunk) => {
        body.push(chunk);
      });

      req.on("end", () => {
        body = Buffer.concat(body).toString();
        const reqData = JSON.parse(body);

        const commodity = {
          id: `commodity-${timeNow}`,
          ...reqData,
        };

        fs.readFile("./data.json", (err, data) => {
          data = JSON.parse(data);

          data.commodities.push(commodity);

          fs.writeFile("./data.json", JSON.stringify(data), "utf-8", (err) => {
            if (err) {
              console.log(`Failed to write to file: ${err}`);
            }
          });

          res.end(
            JSON.stringify({
              status: "success",
              message: "Add commodities success",
              data: commodity,
            })
          );
        });
      });
    } else {
      res.end(
        JSON.stringify({
          status: "fail",
          message: "You are not allowed to access this endpoint.",
        })
      );
    }
  } else if (url == "/farmer-commodities") {
    if (method == "GET") {
      fs.readFile("./data.json", (err, data) => {
        let { farmerCommodities } = JSON.parse(data);
        res.end(
          JSON.stringify({
            status: "success",
            message: "Retrieved farmer commodities",
            data: farmerCommodities,
          })
        );
      });
    } else if (method == "POST") {
      let body = [];

      req.on("data", (chunk) => {
        body.push(chunk);
      });

      req.on("end", () => {
        body = Buffer.concat(body).toString();
        let { farmer_id, commodity_id } = JSON.parse(body);

        if (!farmer_id || !commodity_id) {
          res.statusCode = 400;
          res.end(
            JSON.stringify({
              status: "fail",
              message: "Data tidak boleh kosong",
            })
          );
        } else {
          fs.readFile("./data.json", (err, data) => {
            data = JSON.parse(data);

            const farmersFound = data.farmers.filter((farmer) => {
              return farmer.id == farmer_id;
            });

            const commodityFound = data.commodities.filter((commodity) => {
              return commodity.id == commodity_id;
            });

            if (farmersFound.length < 1) {
              res.statusCode = 404;
              res.end(
                JSON.stringify({
                  status: "fail",
                  message: "Farmer id tidak ditemukan",
                })
              );
            } else if (commodityFound.length < 1) {
              res.statusCode = 404;
              res.end(
                JSON.stringify({
                  status: "fail",
                  message: "Commodity id tidak ditemukan",
                })
              );
            } else {
              data.farmerCommodities.push({
                farmer_id,
                commodity_id,
              });

              fs.writeFile(
                "./data.json",
                JSON.stringify(data),
                "utf-8",
                (err) => {
                  if (err) {
                    res.statusCode = 500;
                    res.end(
                      JSON.stringify({
                        status: "fail",
                        message: "Gagal menambahkan farmer commodities",
                      })
                    );
                  } else {
                    res.end(
                      JSON.stringify({
                        status: "success",
                        message: "Berhasil menambahkan farmer commodities",
                        data: {
                          farmer_id,
                          commodity_id,
                        },
                      })
                    );
                  }
                }
              );
            }
          });
        }
      });
    } else {
      res.end(
        JSON.stringify({
          status: "fail",
          message: "You are not allowed to access this endpoint.",
        })
      );
    }
  } else {
    res.statusCode = 404;
    res.end(
      JSON.stringify({
        status: "fail",
        message: "Endpoint not available",
      })
    );
  }
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
  console.log(`Server berjalan di http://${host}:${port}`);
});
