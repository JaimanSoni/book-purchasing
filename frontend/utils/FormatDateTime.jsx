import React from 'react';

const FormatDateTime = ({ isoDate }) => {
  const formatDateTime = (isoDate) => {
    const date = new Date(isoDate);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year}  ${hours}:${minutes}`;
  };

  return <span>{formatDateTime(isoDate)}</span>;
};

export default FormatDateTime;
