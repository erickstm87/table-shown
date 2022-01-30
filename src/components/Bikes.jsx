import React, {Component} from 'react';
import * as AWS from 'aws-sdk'
import keys from '../ignored-file.js'

import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { logout } from '../signIn/signInForm'


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
            sortedEntries: [],
            filteredEntries: [],
            searchTerm: '',
            toggled: false
        }
    }
    getEntries = async () => {
        this.setState({
            filteredEntries: [],
            bikeEntries: [],
            sortedEntries: []
        })
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
    componentDidMount() {
        this.getEntries()
    }
    handleTheClick = () => {
        logout()
    }
    handleSearch = (event) => {
        const term = event.target.value;
        this.setState((state) => {
           return {
               ...state,
               searchTerm: term,
               filteredEntries: state.bikeEntries.filter((entry) => entry.Model.includes(term))
           } 
        })
        return
    }
    render() {
        const paperStyle = {
            "display": "flex",
            "flexDirection": "column",
            "width": "100%",
            "bgcolor": "background.paper"
        }

        const searchStyle = {
            margin: 'auto',
            width: '50%',
            padding: '10px',
        }
        
        const updateDyn = ((element) => {
            
            element.Interested = 'Yes'
            var params = {
                TableName: 'bike-availability',
                Item: {
                    Link: element.Link,
                    Model: element.Model,
                    TheIndex: element.TheIndex,
                    TimeStamp: element.TimeStamp,
                    Interested: element.Interested
                }
            }
            
            docClient.put(params, function (err, data) {
                if (err) {
                    console.log('Error', err)
                } else {
                    console.log('Success', data)
                }
            })

            this.getEntries()
        })
        return(
            <TableContainer component={Paper} style={paperStyle}>
            <TextField 
                style={searchStyle}
                id="outlined-basic" 
                placeholder={"Which Model"}
                variant="outlined" 
                key="random1"
                type="text"
                value={this.state.searchTerm}
                onChange={this.handleSearch}
            />
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
                    {!this.state.searchTerm && this.state.sortedEntries.map((row) => (
                    <TableRow
                        key={row.Link}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                        {row.Model}
                        </TableCell>
                        <TableCell align="center"><a href={row.Link} target="_blank">{row.Link}</a></TableCell>
                        <TableCell align="center">{row.TimeStamp}</TableCell>
                        {row.Interested === 'Yes' &&
                            <TableCell><Button disabled variant="contained" align="center">Interested</Button></TableCell>
                        }
                        {!row.Interested &&
                            <TableCell><Button onClick= {() => updateDyn(row)} variant="contained" align="center">Yes</Button></TableCell>
                        }
                    </TableRow> 
                    ))}   
                    {this.state.searchTerm && this.state.filteredEntries.map((row) => (
                    <TableRow
                        key={row.Link}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                        {row.Model}
                        </TableCell>
                        <TableCell align="center"><a href={row.Link} target="_blank">{row.Link}</a></TableCell>
                        <TableCell align="center">{row.TimeStamp}</TableCell>
                        {row.Interested === 'Yes' &&
                            <TableCell><Button disabled variant="contained" align="center">Interested</Button></TableCell>
                        }
                        {!row.Interested &&
                            <TableCell><Button onClick= {() => updateDyn(row)} variant="contained" align="center">Yes</Button></TableCell>
                        }
                    </TableRow>
                    ))}
                </TableBody> 
               
            </Table>
            <Button onClick={this.handleTheClick} variant="contained">Log Out</Button>
          </TableContainer>
        )
    }
}

export default Bikes