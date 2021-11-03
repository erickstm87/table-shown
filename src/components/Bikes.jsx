import React, {Component, useState} from 'react';
import * as AWS from 'aws-sdk'
import keys from '../ignored-file.js'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const configuration = {
    region: keys.theRegion,
    secretAccessKey: keys.secretKey,
    accessKeyId: keys.accessKey
}

AWS.config.update(configuration)
const docClient = new AWS.DynamoDB.DocumentClient()

class Bikes extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bikeEntries: []
        }
    }
    componentDidMount() {
        var params = {
            TableName: 'bike-availability'
        }
        docClient.scan(params, async (err, data) => {
            if (!err) {
                console.log(data)
                
                await data.Items.forEach((entry) => {
                    this.setState({bikeEntries: [...this.state.bikeEntries, entry] })
                })
                console.log(this.state.bikeEntries);
            }
            else {
                console.log('there was an error: ', err)
            }
        })
    }
    render() {
        const paperStyle = {
            "display": "flex",
            "flexDirection": "column",
            "width": "100%",
            "bgcolor": "background.paper"
        }
        return(
            <TableContainer component={Paper} style={paperStyle}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Model</TableCell>
                  <TableCell align="left">Link</TableCell>
                  <TableCell align="left">Interested?</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.bikeEntries.map((row) => (
                  <TableRow
                    key={row.TimeStamp}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.Model}
                    </TableCell>
                    <TableCell align="left">{row.Link}</TableCell>
                    <TableCell align="left">Yes/No</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
    }
}

export default Bikes