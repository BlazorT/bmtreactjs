import React from 'react';

import calculateTime from 'src/helpers/calculateTime';

const CustomSummary = (prop) => {
  const { rows, columns, summary } = prop;

  const calculateStatusCount = (status) => {
    return rows.filter((row) => row.daStatus === status).length;
  };

  const calculatedSummary = summary.map((summaryItem) => {
    const { field, aggregates } = summaryItem;

    if (!field || !aggregates) {
      return null;
    }

    const column = columns.find((col) => col.field === field);
    if (!column) {
      return null;
    }

    const columnType = column.type || 'string';
    const columnValues = rows.map((row) => row[field]);

    const summaryResult = {
      field,
    };

    aggregates.forEach(({ aggregate, caption }) => {
      switch (aggregate.toLowerCase()) {
        case 'count':
          summaryResult.count = `${caption} : ${columnValues.length}`;
          break;
        case 'sum':
          summaryResult.sum = `${caption} : ${columnValues
            .reduce((acc, value) => acc + value, 0)
            .toLocaleString()}`;
          break;
        case 'min':
          if (columnType === 'timestamp') {
            const timestamps = columnValues.map(
              (timestamp) => timestamp !== undefined && new Date(timestamp),
            );
            const { min } = calculateTime(timestamps);
            summaryResult.min = `${caption} : ${min}`;
          } else {
            summaryResult.min = `${caption} : ${Math.min(...columnValues)}`;
          }
          break;
        case 'max':
          if (columnType === 'timestamp') {
            const timestamps = columnValues.map(
              (timestamp) => timestamp !== undefined && new Date(timestamp),
            );
            const { max } = calculateTime(timestamps);
            summaryResult.max = `${caption} : ${max}`;
          } else {
            summaryResult.max = `${caption} : ${Math.max(...columnValues)}`;
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
          // Calculate median
          const sortedValues = columnValues.slice().sort((a, b) => a - b);
          const mid = Math.floor(sortedValues.length / 2);

          if (sortedValues.length % 2 === 0) {
            summaryResult.median = `${caption} : ${
              (sortedValues[mid - 1] + sortedValues[mid]) / 2
            }`;
          } else {
            summaryResult.median = `${caption} : ${sortedValues[mid]}`;
          }
          break;
        }
        // Add more custom aggregate functions as needed
        default:
          break;
      }
    });

    return summaryResult;
  });

  return (
    <div className="mt-0 p-2 bg-dark-color">
      <div className="grid-footer-summary">
        {calculatedSummary.map((summaryItem) => (
          <div key={summaryItem.field} className="align-self-start">
            <ul className="m-0 p-2 grid-footer-summary">
              {Object.entries(summaryItem)
                .filter(([key]) => key !== 'field') // Exclude 'field' from displaying
                .map(([aggregate, value]) => (
                  <li className="p-1" key={aggregate}>
                    {value !== undefined
                      ? aggregate === 'statusCount'
                        ? Object.entries(value).map(([status, count], index, array) => (
                            <span key={status}>
                              <span className="">{`${status} : ${count.toLocaleString()}`}</span>
                              {index < array.length - 1 && (
                                <span className="me-2 ms-2 border-end"></span>
                              )}
                            </span>
                          ))
                        : value.toLocaleString()
                      : 'N/A'}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSummary;
