import Product from "../schema/schema.js";


// Total sale amount of selected month
export const getSaleAmountOfSelectedMonth = async (request, response) => {
  const selectedMonth = 7;
  try {
    const salesData = await Product.aggregate([
      {
        $match: {
          dateOfSale: {
            $gte: new Date(`2022-${selectedMonth}-01`),
            $lt: new Date(`2022-${selectedMonth + 1}-01`),
          },
          sold: true,
        },
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: "$price" },
          totalProducts: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalPrice: 1,
          totalProducts: 1,
        },
      },
    ]);
    console.log(salesData);
    response.status(200).json(salesData);
  } catch (error) {
    console.log(`Error: sale-amount-of-selected-month`, error);
  }
};

// - Total number of sold items of selected month

export const getNumOfSoldItems = async (request, response) => {
  const selectedMonth = 7;
  try {
    const soldItems = await Product.aggregate([
      {
        $match: {
          dateOfSale: {
            $gte: new Date(`2022-${selectedMonth}-01`),
            $lt: new Date(`2022-${selectedMonth + 1}-01`),
          },
          sold: true,
        },
      },
      {
        $group: {
          _id: null,
          totalSoldProducts: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalSoldProducts: 1,
        },
      },
    ]);

    console.log(soldItems);
    response.status(200).json(soldItems);
  } catch (error) {
    console.log(`Error - number of sold items month`, error);
    response.status(404).json(error.message);
  }
};

// - Total number of not sold items of selected month
export const getNumOfNotSoldItems = async (request, response) => {
  const selectedMonth = 7;
  try {
    const notSoldItems = await Product.aggregate([
      {
        $match: {
          // dateOfSale: {
          //   $gte: new Date(`2022-${selectedMonth}-01`),
          //   $lt: new Date(`2022-${selectedMonth + 1}-01`),
          // },
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, selectedMonth],
          },
          sold: false,
        },
      },
      {
        $group: {
          _id: null,
          totalNotSoldProducts: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalNotSoldProducts: 1,
        },
      },
    ]);

    console.log(notSoldItems);
    response.status(200).json(notSoldItems);
  } catch (error) {
    console.log(`Error - number of sold items month`, error);
    response.status(404).json(error.message);
  }
};


//getting Bar Chart with given range
export const getBarChart = async (request, response) => {
  const selectedMonth = 5;
  try {
    const barReport = await Product.aggregate([
      {
        $match: {
          // dateOfSale: {
          //   $gte: new Date(`2022-${selectedMonth}-01`),
          //   $lt: new Date(`2022-${selectedMonth + 1}-01`),
          // },
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, selectedMonth],
          },
        },
      },
      {
        $facet: {
          zero_hun: [
            {
              $match: {
                price: {
                  $gte: 0,
                  $lte: 100,
                },
              },
            },
          ],
          hun_twohun: [
            {
              $match: {
                price: {
                  $gt: 100,
                  $lte: 200,
                },
              },
            },
          ],
          twohun_threehun: [
            {
              $match: {
                price: {
                  $gt: 200,
                  $lte: 300,
                },
              },
            },
          ],
          threehun_fourhun: [
            {
              $match: {
                price: {
                  $gt: 300,
                  $lte: 400,
                },
              },
            },
          ],
          fourHun_fivehun: [
            {
              $match: {
                price: {
                  $gt: 400,
                  $lte: 500,
                },
              },
            },
          ],
          fivehun_sixhun: [
            {
              $match: {
                price: {
                  $gt: 500,
                  $lte: 600,
                },
              },
            },
          ],
          sixhun_sevenhun: [
            {
              $match: {
                price: {
                  $gt: 600,
                  $lte: 700,
                },
              },
            },
          ],
          sevenhun_eighthun: [
            {
              $match: {
                price: {
                  $gt: 700,
                  $lte: 800,
                },
              },
            },
          ],
          eighthun_ninehun: [
            {
              $match: {
                price: {
                  $gt: 800,
                  $lte: 900,
                },
              },
            },
          ],
          above_ninehun: [
            {
              $match: {
                price: {
                  $gt: 900,
                },
              },
            },
          ],
        },
      },
    ]);

    console.log(barReport[0]);
    response.status(200).json(barReport[0]);
  } catch (error) {
    console.log("Error - api bar chart", error);
  }
};


//getting unique Categories
export const getUniqueCategories = async (request, response) => {
  const selectedMonth = 1;
  try {
    const categories = await Product.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, selectedMonth],
          },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          month: `${selectedMonth}`,
          category: "$_id",
          _id: 0,
          count: 1,
        },
      },
    ]);
    response.status(200).json(categories);
    console.log(categories);
  } catch (error) {
    console.log(`error on get-categories-of-month`, error);
  }
};


// getting all the above API data at once
export const getAllAPIJsonData = async (request, response) => {
  const selectedMonth = 6;
  //sales Data
  const salesData = await Product.aggregate([
    {
      $match: {
        dateOfSale: {
          $gte: new Date(`2022-${selectedMonth}-01`),
          $lt: new Date(`2022-${selectedMonth + 1}-01`),
        },
        sold: true,
      },
    },
    {
      $group: {
        _id: null,
        totalPrice: { $sum: "$price" },
        totalProducts: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        totalPrice: 1,
        totalProducts: 1,
      },
    },
  ]);
  // sold Items
  const soldItems = await Product.aggregate([
    {
      $match: {
        dateOfSale: {
          $gte: new Date(`2022-${selectedMonth}-01`),
          $lt: new Date(`2022-${selectedMonth + 1}-01`),
        },
        sold: true,
      },
    },
    {
      $group: {
        _id: null,
        totalSoldProducts: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        totalSoldProducts: 1,
      },
    },
  ]);

  // Not sold items
  const notSoldItems = await Product.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $month: "$dateOfSale" }, selectedMonth],
        },
        sold: false,
      },
    },
    {
      $group: {
        _id: null,
        totalNotSoldProducts: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        totalNotSoldProducts: 1,
      },
    },
  ]);

  //bar report

  const barReport = await Product.aggregate([
    {
      $match: {
        // dateOfSale: {
        //   $gte: new Date(`2022-${selectedMonth}-01`),
        //   $lt: new Date(`2022-${selectedMonth + 1}-01`),
        // },
        $expr: {
          $eq: [{ $month: "$dateOfSale" }, selectedMonth],
        },
      },
    },
    {
      $facet: {
        zero_hun: [
          {
            $match: {
              price: {
                $gte: 0,
                $lte: 100,
              },
            },
          },
        ],
        hun_twohun: [
          {
            $match: {
              price: {
                $gt: 100,
                $lte: 200,
              },
            },
          },
        ],
        twohun_threehun: [
          {
            $match: {
              price: {
                $gt: 200,
                $lte: 300,
              },
            },
          },
        ],
        threehun_fourhun: [
          {
            $match: {
              price: {
                $gt: 300,
                $lte: 400,
              },
            },
          },
        ],
        fourHun_fivehun: [
          {
            $match: {
              price: {
                $gt: 400,
                $lte: 500,
              },
            },
          },
        ],
        fivehun_sixhun: [
          {
            $match: {
              price: {
                $gt: 500,
                $lte: 600,
              },
            },
          },
        ],
        sixhun_sevenhun: [
          {
            $match: {
              price: {
                $gt: 600,
                $lte: 700,
              },
            },
          },
        ],
        sevenhun_eighthun: [
          {
            $match: {
              price: {
                $gt: 700,
                $lte: 800,
              },
            },
          },
        ],
        eighthun_ninehun: [
          {
            $match: {
              price: {
                $gt: 800,
                $lte: 900,
              },
            },
          },
        ],
        above_ninehun: [
          {
            $match: {
              price: {
                $gt: 900,
              },
            },
          },
        ],
      },
    },
  ]);

  //unique Categories

  const categories = await Product.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $month: "$dateOfSale" }, selectedMonth],
        },
      },
    },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        month: `${selectedMonth}`,
        category: "$_id",
        _id: 0,
        count: 1,
      },
    },
  ]);

  response.status(200).json({
    salesData,
    soldItems,
    notSoldItems,
    barReport,
    categories,
  });
  console.log({
    salesData,
    soldItems,
    notSoldItems,
    barReport,
    categories,
  });
};
