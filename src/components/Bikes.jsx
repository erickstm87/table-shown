import React, {Component} from 'react';
import * as AWS from 'aws-sdk'
import keys from '../ignored-file.js'

// import Search from './Search.jsx';
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
    getEntries = () => {
        this.setState({bikeEntries: []})
        this.setState({sortedEntries: []})
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
    componentWillMount() {
        this.getEntries()
    }
    componentDidUpdate() {
        if(this.state.searchTerm.length > 0 && !this.state.toggled) {
            // console.log('this is being called before', this.state.searchTerm);
        }
        else {
            // console.log('no term yet');
        }
    }
    handleTheClick = () => {
        logout()
    }
    handleSearch = async (event) => {
        const term = event.target.value;
        await this.setState({searchTerm: term})
        const filteredBikes = this.state.bikeEntries.filter((entry) => entry.Model.includes(term))
        await this.setState({filteredEntries: filteredBikes})
        this.forceUpdate();
        // console.log('heyyyyyyyyy being called!!!!', term, JSON.stringify(this.state.filteredEntries));
        await setTimeout(() => {console.log('timeout is being called')}, 1000);
        debugger
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
            {/* <Button variant="contained" onClick={() => app.auth().signOut()}>Log Out</Button> */}
            <Button onClick={this.handleTheClick} variant="contained" >Log Out</Button>
            <TextField 
                style={searchStyle}
                id="outlined-basic" 
                placeholder={"Which Model"}
                variant="outlined" 
                key="random1"
                type="text"
                // value={term}
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
                    {/* {!this.state.searchTerm && this.state.sortedEntries.map((row) => (
                    <TableRow
                        key={row.TimeStamp}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                        {row.Model}
                        </TableCell>
                        <TableCell align="center"><a href={row.Link} target="_blank">{row.Link}</a></TableCell>
                        <TableCell align="center">{row.TimeStamp}</TableCell>
                        { row.Interested === 'Yes' &&
                            <TableCell><Button disabled variant="contained" align="center">Interested</Button></TableCell>
                        }
                        { !row.Interested &&
                            <TableCell><Button onClick= {() => updateDyn(row)} variant="contained" align="center">Yes</Button></TableCell>
                        }
                    </TableRow> 
                    ))}    */}
                    {this.state.filteredEntries.map((row) => (
                    <TableRow
                        key={row.TimeStamp}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                        {row.Model}
                        </TableCell>
                        <TableCell align="center"><a href={row.Link} target="_blank">{row.Link}</a></TableCell>
                        <TableCell align="center">{row.TimeStamp}</TableCell>
                        { row.Interested === 'Yes' &&
                            <TableCell><Button disabled variant="contained" align="center">Interested</Button></TableCell>
                        }
                        { !row.Interested &&
                            <TableCell><Button onClick= {() => updateDyn(row)} variant="contained" align="center">Yes</Button></TableCell>
                        }
                    </TableRow>
                    ))}
                </TableBody> 
            </Table>
          </TableContainer>
        )
    }
}

export default Bikes