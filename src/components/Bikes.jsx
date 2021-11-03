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
import Button from '@mui/material/Button';


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
            bikeEntries: [],
            sortedEntries: []
        }
    }
    componentDidMount() {
        var params = {
            TableName: 'bike-availability'
        }
        docClient.scan(params, async (err, data) => {
            if (!err) {                
                await data.Items.forEach((entry) => {
                    this.setState({bikeEntries: [...this.state.bikeEntries, entry] })
                })
                const sortedArray = this.state.bikeEntries.sort((a, b) => { return new Date(b.TimeStamp) - new Date(a.TimeStamp) })
                this.setState({sortedEntries: sortedArray})
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
                  <TableCell align="center">Link</TableCell>
                  <TableCell align="center">Time Sorted</TableCell>
                  <TableCell align="left">Interested?</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.sortedEntries.map((row) => (
                  <TableRow
                    key={row.TimeStamp}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.Model}
                    </TableCell>
                    <TableCell align="center"><a href={row.Link} target="_blank">{row.Link}</a></TableCell>
                    <TableCell align="center">{row.TimeStamp}</TableCell>
                    <TableCell><Button variant="contained" align="center">Yes</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
    }
}

export default Bikes