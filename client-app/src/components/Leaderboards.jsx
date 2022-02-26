import React, { useEffect, useState, useRef } from "react";
import { Row, Form, Container, Col, Button, Select } from "react-bootstrap";
import axios from "axios";
import { useTable, useSortBy } from "react-table";

const Leaderboards = () => {
  const chosenBetFilter = useRef();
  const [selectedBetFilter, setSelectedBetFilter] = useState("overall");

  const [data, setBetLeaderboard] = useState([
    {
      id: "aaaa",
      username: "zzzz",
      ROI: 22,
      amountBet: 22,
      profitLoss: 22,
      averageOdds: 33,
      totalBets: 33,
      winCount: 22,
      lossCount: 33,
      pushCount: 22,
      pendingCount: 22,
    },
  ]);

  useEffect(() => {
    getBettingLeaderboard();
  }, [selectedBetFilter]);

  const showBetStats = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedBetFilter(chosenBetFilter.current.value);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "id",
        accessor: "id",
      },
      {
        Header: "Username",
        accessor: "username",
      },
      {
        Header: "ROI (%)",
        accessor: "ROI",
      },
      {
        Header: "Amount Bet ($)",
        accessor: "amountBet",
      },
      {
        Header: "Profit/Loss ($)",
        accessor: "profitLoss",
      },
      {
        Header: "Average Odds",
        accessor: "averageOdds",
      },
      {
        Header: "Total Bets",
        accessor: "totalBets",
      },
      {
        Header: "Win Count",
        accessor: "winCount",
      },
      {
        Header: "Loss Count",
        accessor: "lossCount",
      },
      {
        Header: "Push Count",
        accessor: "pushCount",
      },
      {
        Header: "Pending Count",
        accessor: "pendingCount",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState: {
          sortBy: [
            {
              id: "ROI",
              desc: true,
            },
          ],
        },
      },
      useSortBy
    );

  const getBettingLeaderboard = async () => {
    let url = "http://localhost:3001/api/display-leaderboard";
    await axios
      .get(url, {
        params: {
          filter: selectedBetFilter,
        },
      })
      .then(function (response) {
  
        if (response.data.success == true) {
          let data_result = response.data.result;

          cleanLeaderBoardData(data_result);

        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const cleanLeaderBoardData = (user_data) => {
    let cleanedArr = [];
    let sports = ["NHL", "NBA", "NFL"];
    let betTypes = ["moneyline", "spread", "parlay"];

    let filter1 = "",
      filter2 = "";
    if (selectedBetFilter == "overall") {
      filter1 = "overall";
      filter2 = "all";
    } else if (sports.includes(selectedBetFilter)) {
      filter1 = "sports";
      filter2 = selectedBetFilter;
    } else if (betTypes.includes(selectedBetFilter)) {
      filter1 = "betTypes";
      filter2 = selectedBetFilter;
    }
    for (var i = 0; i < user_data.length; i++) {
      if (
        user_data[i].stats != null &&
        user_data[i].stats[filter1] != null &&
        user_data[i].stats[filter1][filter2] != null
      ) {


        let stats = user_data[i].stats[filter1][filter2];

        let profitLoss = parseFloat(
          parseFloat(stats.profitLoss.split("$")[1]).toFixed(2)
        );
        if (stats.profitLoss.includes("-")) profitLoss = profitLoss * -1;

        let userData = {
          id: user_data[i]._id,
          username: user_data[i].username,
          ROI: parseFloat(stats.ROI.split("%")[0]),
          amountBet: stats.amountBet,
          profitLoss: profitLoss,
          averageOdds: parseFloat(parseFloat(stats.averageOdds).toFixed(2)),
          totalBets: stats.totalBets,
          winCount: stats.winCount,
          lossCount: stats.lossCount,
          pushCount: stats.pushCount,
          pendingCount: stats.pendingCount,
        };


        cleanedArr.push(userData);
      }
    }

    setBetLeaderboard(cleanedArr);
  };

  return (
    <>
      <Container>
        <Row>
          <h1 className="text-center headingLine">Leaderboards</h1>
        </Row>
        <Row className="mrgn-btm-3p">
          <Form>
            <Row className="d-flex justify-content-center">
              <Col xs="3">
                <Form.Select ref={chosenBetFilter}>
                  <option value="overall">Overall</option>
                  <option value="moneyline">Moneyline</option>
                  <option value="spread">Spread</option>
                  <option value="parlay">Parlay</option>
                  <option value="NFL">NFL</option>
                  <option value="NHL">NHL</option>
                  <option value="NBA">NBA</option>
                </Form.Select>
              </Col>
              <Col xs="1" className="d-flex justify-content-center">
                <Button variant="danger" onClick={showBetStats}>
                  Filter
                </Button>
              </Col>
            </Row>
          </Form>
        </Row>

        <Row>
          <table {...getTableProps()} className="leaderboard-table">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => {
                    return (
                      <>

                        {column.id != "id" ? (
                          <th
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                          >
                            {column.render("Header")}
                            {/* Add a sort direction indicator */}
                            <span>
                              {column.isSorted
                                ? column.isSortedDesc
                                  ? <i class="bi text-danger bi-arrow-down-square-fill"></i>
                                  : <i class="bi text-success bi-arrow-up-square-fill"></i>
                                : ""}
                            </span>
                          </th>
                        ) : (
                          <></>
                        )}
                      </>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, i) => {
                prepareRow(row);
                return (
                  <>
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <>
    
                            {cell.column.Header == "Username" ? (
                              <td {...cell.getCellProps()}>
                  
                                <a type="button" href={`profile/${row.values.id}`} class="btn w-100 btn-primary">{cell.render("Cell")}</a>

                              </td>
                            ) : cell.column.Header != "id" ? (
                              <td {...cell.getCellProps()}>
                                {cell.render("Cell")}
                              </td>
                            ) : (
                              <></>
                            )}
                          </>
                        );
                      })}
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </Row>
      </Container>
    </>
  );
};

export default Leaderboards;
