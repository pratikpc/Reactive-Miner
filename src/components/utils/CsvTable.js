import React, { useState, useEffect, useContext } from 'react';
import { csvContext } from '../context/csv-context';
import MUIDataTable from "mui-datatables";

const CsvTable = () => {
    const { csv } = useContext(csvContext);
    const [columns, setColumns] = useState([])
    const [data, setData] = useState([]);

    useEffect( () => {
        if (csv) {
            async function Fetch() {
                setColumns(await csv.columnNames());
                setData(await csv.toArray())
            }
            Fetch();
        }
    }, [csv])

    const options = {
        filterType: "dropdown",
        responsive: "scroll"
    };

    return (
        <div className="csv-table">
            {csv ? (
                <MUIDataTable
                    title={"Data Table"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            ) : (
                    <div style={{ textAlign: 'center' }}>
                        <h3>No Data Found</h3>
                    </div>
                )}
        </div>
    );
}

export default CsvTable;