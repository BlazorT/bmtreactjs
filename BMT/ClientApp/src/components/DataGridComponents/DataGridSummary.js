/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
import React from 'react';
import { Column } from 'react-data-grid';
import calculateTime from 'src/helpers/calculateTime';

const CustomSummary = ({ rows, columns, summary }) => {
  if (rows.length === 0) {
    return null;
  }
  const calculateStatusCount = (status) => {
    return rows.filter((row) => row.daStatus === status).length;
  };

  const calculatedSummary = summary
    .map((summaryItem) => {
      const { field, aggregates } = summaryItem;

      if (!field || !aggregates) {
        return null;
      }

      // Find column by key (React Data Grid uses 'key' instead of 'field')
      const column = columns.find((col) => col.key === field);
      if (!column) {
        return null;
      }
      const columnType = column.type || 'string';
      const columnValues = rows
        .map((row) => row[field])
        .filter((val) => val !== null && val !== undefined);

      const summaryResult = {
        field,
      };

      aggregates.forEach(({ aggregate, caption }) => {
        switch (aggregate.toLowerCase()) {
          case 'count':
            summaryResult.count = `${caption} : ${columnValues.length}`;
            break;

          case 'sum':
            // eslint-disable-next-line no-case-declarations
            const numericValues = columnValues.filter((val) => !isNaN(Number(val)));
            summaryResult.sum = `${caption} : ${numericValues
              .reduce((acc, value) => acc + Number(value), 0)
              .toLocaleString()}`;
            break;

          case 'min':
            if (columnType === 'timestamp' || columnType === 'date') {
              const timestamps = columnValues
                .filter((timestamp) => timestamp !== undefined)
                .map((timestamp) => new Date(timestamp));

              if (timestamps.length > 0) {
                try {
                  const { min } = calculateTime(timestamps);
                  summaryResult.min = `${caption} : ${min}`;
                } catch (error) {
                  summaryResult.min = `${caption} : N/A`;
                }
              } else {
                summaryResult.min = `${caption} : N/A`;
              }
            } else {
              const numericValues = columnValues.filter((val) => !isNaN(Number(val)));
              if (numericValues.length > 0) {
                summaryResult.min = `${caption} : ${Math.min(...numericValues.map(Number))}`;
              } else {
                summaryResult.min = `${caption} : N/A`;
              }
            }
            break;

          case 'max':
            if (columnType === 'timestamp' || columnType === 'date') {
              const timestamps = columnValues
                .filter((timestamp) => timestamp !== undefined)
                .map((timestamp) => new Date(timestamp));

              if (timestamps.length > 0) {
                try {
                  const { max } = calculateTime(timestamps);
                  summaryResult.max = `${caption} : ${max}`;
                } catch (error) {
                  summaryResult.max = `${caption} : N/A`;
                }
              } else {
                summaryResult.max = `${caption} : N/A`;
              }
            } else {
              const numericValues = columnValues.filter((val) => !isNaN(Number(val)));
              if (numericValues.length > 0) {
                summaryResult.max = `${caption} : ${Math.max(...numericValues.map(Number))}`;
              } else {
                summaryResult.max = `${caption} : N/A`;
              }
            }
            break;

          case 'statuscount': {
            const statusCounts = {
              'On-Boarding': calculateStatusCount('Onboarding'),
              'On-Boarded': calculateStatusCount('On Boarded'),
              'Off-Boarded': calculateStatusCount('Off Boarded'),
            };
            summaryResult.statusCount = statusCounts;
            break;
          }

          case 'median': {
            const numericValues = columnValues
              .filter((val) => !isNaN(Number(val)))
              .map(Number)
              .sort((a, b) => a - b);

            if (numericValues.length > 0) {
              const mid = Math.floor(numericValues.length / 2);

              if (numericValues.length % 2 === 0) {
                summaryResult.median = `${caption} : ${(
                  (numericValues[mid - 1] + numericValues[mid]) /
                  2
                ).toLocaleString()}`;
              } else {
                summaryResult.median = `${caption} : ${numericValues[mid].toLocaleString()}`;
              }
            } else {
              summaryResult.median = `${caption} : N/A`;
            }
            break;
          }

          case 'average':
          case 'avg': {
            const numericValues = columnValues.filter((val) => !isNaN(Number(val))).map(Number);
            if (numericValues.length > 0) {
              const average =
                numericValues.reduce((acc, val) => acc + val, 0) / numericValues.length;
              summaryResult.average = `${caption} : ${average.toFixed(2)}`;
            } else {
              summaryResult.average = `${caption} : N/A`;
            }
            break;
          }

          default:
            console.warn(`Unknown aggregate function: ${aggregate}`);
            break;
        }
      });

      return summaryResult;
    })
    .filter(Boolean); // Remove null results

  if (calculatedSummary.length === 0) {
    return null;
  }

  return (
    <div className="summary-container mt-0 p-1 bg-dark-color text-white ">
      <div className="grid-footer-summary">
        {calculatedSummary.map((summaryItem) => {
          const entries = Object.entries(summaryItem).filter(([key]) => key !== 'field');

          return (
            <div key={summaryItem.field} className="align-self-start">
              <ul className="m-0 p-2 grid-footer-summary list-unstyled">
                {entries.map(([aggregate, value], sIndex) => (
                  <li className="p-1 d-inline-block" key={aggregate}>
                    {value !== undefined
                      ? aggregate === 'statusCount'
                        ? Object.entries(value).map(([status, count], index, array) => (
                            <span key={status}>
                              <span>{`${status} : ${count.toLocaleString()}`}</span>
                              {index < array.length - 1 && (
                                <span className="me-1 ms-1 border-end"></span>
                              )}
                            </span>
                          ))
                        : typeof value === 'string'
                          ? value
                          : String(value)
                      : 'N/A'}

                    {/* ✅ Use entries.length here instead of summaryItem.length */}
                    {sIndex < entries.length - 1 && <span className="me-1 ms-1 text-muted">|</span>}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomSummary;
