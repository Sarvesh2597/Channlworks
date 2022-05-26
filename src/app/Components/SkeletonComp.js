import React from "react";
import Skeleton from '@material-ui/lab/Skeleton';
export default function SkeletonComp({ rows, columns }) {
    console.log(Array(rows));
    return (
        <React.Fragment>
            {[...Array(rows)].map((u, i) => i).map(item => {
                return <tr>
                    <React.Fragment>
                    {[...Array(columns)].map((u, i) => i).map(item => {
                        return <td>
                            <Skeleton variant="rect" />
                        </td>
                    })}
                    </React.Fragment>
                </tr>
            })}
        </React.Fragment>

    )
}