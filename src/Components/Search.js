import React,{Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCircle, faHeading } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Link } from '@mui/material';
import ReactTimeAgo from 'react-time-ago';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import ReactHtmlParser from 'react-html-parser';
import ListItemAvatar from '@mui/material/ListItemAvatar';

class Search extends Component {
constructor() {
    super();

    this.state = {
        news: null,
        currPage: 1,
        parr:[1],
        loading: true,
        tag: "story",
        sort: "Popularity",
        timeRange: "All Time",
        time: 0,
        query: ""
    };
}

    async componentDidMount(){
        const urlParams = new URLSearchParams(window.location.search);
        let value = urlParams.get('query');
        if(value === null){
            value = "";
        }
        this.setState({
            query: value
        },this.changeNews)
    }

    changeNews = async () => {
        if(this.state.sort === "Popularity"){
            const res = await axios.get(`https://hn.algolia.com/api/v1/search?query=${this.state.query}&tags=${this.state.tag}&numericFilters=created_at_i>${this.state.time}&page=${this.state.currPage-1}&hitsPerPage=30`);
            let data = res.data;
            this.setState({
                news: [...data.hits],
                loading: false
            })
            // console.log(data.hits)
        }
        else{
            const res = await axios.get(`https://hn.algolia.com/api/v1/search_by_date?query=${this.state.query}&tags=${this.state.tag}&numericFilters=created_at_i>${this.state.time}&page=${this.state.currPage-1}&hitsPerPage=30`);
            let data = res.data;
            this.setState({
                news: [...data.hits],
                loading: false
            })
            // console.log(data.hits)
        }
    }

    handleRight = () => {
        if(this.state.currPage === this.state.parr.length){
            let temparr = [];
            for(let i=1;i<=this.state.parr.length+1;i++){
                temparr.push(i);
            }
            this.setState({
                parr : [...temparr],
                currPage : this.state.currPage+1,
                loading: true
            },this.changeNews)
        }
        else{
            this.setState({
                currPage : this.state.currPage+1,
                loading: true
            },this.changeNews)
        }
    }
    handleLeft = () =>{
        if(this.state.currPage !== 1){
            this.setState({
                currPage : this.state.currPage - 1,
                loading: true  
            },this.changeNews)
        }
    }

    handleClick = (value) =>{
        if(value !== this.state.currPage){
            this.setState({
                currPage : value,
                loading: true
            },this.changeNews)
        }
    }

    handleTagFilter = (event) => {
        let value = event.target.value;
        if(value === "All"){
            value = "";
        }
        this.setState({
            tag: value,
            loading: true,
            currPage: 1,
            parr:[1],
        },this.changeNews)
    };

    handleSortFilter = (event) => {
        this.setState({
            sort: event.target.value,
            loading: true,
            currPage: 1,
            parr:[1],
        },this.changeNews)
    }

    handleTimeRange = (event) =>{
        let d = new Date();
        const seconds = Math.floor(d.getTime() / 1000);

        this.setState({
            timeRange: event.target.value,
            loading: true,
            currPage: 1,
            parr:[1],
        })

        if(event.target.value === "All Time"){
            this.setState({
                time: 0
            },this.changeNews)
        }
        else if(event.target.value === "Last 24H"){
            this.setState({
                time: (seconds - (24*60*60))
            },this.changeNews)
        }
        else if(event.target.value === "Past Week"){
            this.setState({
                time: (seconds - (7*24*60*60))
            },this.changeNews)
        }
        else if(event.target.value === "Past Month"){
            this.setState({
                time: (seconds - (30*24*60*60))
            },this.changeNews)
        }
        else if(event.target.value === "Past Year"){
            this.setState({
                time: (seconds - (365*24*60*60))
            },this.changeNews)
        }
    }

    handleSearchQuery = (event) =>{
        this.setState({
            query: event.target.value,
            loading: true,
            currPage: 1,
            parr:[1],
        },this.changeNews)
    }

    render() {
        return(
            <div style={{backgroundColor: 'black',minWidth: '100vw',minHeight: '100vh'}}>
                <div className="home-container" style={{backgroundColor: 'white'}}>
                    <div className="search-page-header">
                        <FontAwesomeIcon className="head-icon" icon={faHeading}/>
                        <div className="search-heading">Search <br/> Hacker News</div>
                        <FontAwesomeIcon className="search-icon" icon={faMagnifyingGlass}/>
                        <OutlinedInput placeholder="Search Stories by Title, URL or Author" value={this.state.query} onChange={(e)=>this.handleSearchQuery(e)} style={{width: '80%',backgroundColor:'white',fontSize: 'medium'}} />
                    </div>
                    <div className="filter-bar">
                        <p className="display-none" style={{marginLeft: '0.7%'}}>Search</p>
                        <FormControl className="select-labels" sx={{m: 1}} size="small">
                            <InputLabel id="demo-select-small"></InputLabel>
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={this.state.tag === "" ? "All" : this.state.tag}
                                onChange={this.handleTagFilter}
                            >
                                <MenuItem value={"All"}>All</MenuItem>
                                <MenuItem value={"story"}>Stories</MenuItem>
                                <MenuItem value={"comment"}>Comments</MenuItem>
                            </Select>
                        </FormControl>
                        <p className="display-none">by</p>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="demo-select-small"></InputLabel>
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={this.state.sort}
                                onChange={this.handleSortFilter}
                            >
                                <MenuItem value={"Popularity"}>Popularity</MenuItem>
                                <MenuItem value={"Date"}>Date</MenuItem>
                            </Select>
                        </FormControl>
                        <p className="display-none">for</p>
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="demo-select-small"></InputLabel>
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={this.state.timeRange}
                                onChange={this.handleTimeRange}
                            >
                                <MenuItem value={"All Time"}>All Time</MenuItem>
                                <MenuItem value={"Last 24H"}>Last 24H</MenuItem>
                                <MenuItem value={"Past Week"}>Past Week</MenuItem>
                                <MenuItem value={"Past Month"}>Past Month</MenuItem>
                                <MenuItem value={"Past Year"}>Past Year</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    {
                        this.state.loading === true ? 
                        <CircularProgress/>:
                        <List sx={{ width: '100%', bgcolor: '#f6f6ef' }}>
                            {
                                this.state.news.map((element,index)=>{
                                    return(
                                        <ListItem key={element.objectID} sx={{paddingTop: 0, paddingBottom: 0}}>
                                            <ListItemAvatar sx={{minWidth: 20, padding: 0, paddingRight: 1}}>
                                                <FontAwesomeIcon className="list-icon" icon={faCircle}/>
                                            </ListItemAvatar>
                                            {
                                                element.title === null  || element.title === "" ? 
                                                <ListItemText secondary={
                                                    <Link sx={{lineHeight: 'auto'}} underline="none" href={element.url} style={{cursor:'pointer', color: 'black'}}><div>{ReactHtmlParser(element.comment_text)}</div></Link>} 
                                                    primary={
                                                    <>
                                                    <div style={{fontSize: '12px'}}>
                                                        {element.points === null ? 0 : element.points} points | <Link style={{cursor:'pointer'}} underline='hover'>{element.author}</Link>
                                                        &nbsp;|&nbsp; 
                                                        <Link style={{cursor:'pointer', color: 'grey'}} underline='hover'><ReactTimeAgo date={Date.parse(element.created_at)} locale="en-US"/></Link>
                                                        &nbsp;| on: <Link style={{cursor:'pointer', color: 'grey'}} underline='hover'>{element.story_title}</Link>
                                                    </div>
                                                    </>
                                                }/>
                                                :
                                                <ListItemText primary={
                                                    <Link sx={{lineHeight: 'auto'}} underline="none" href={element.url} style={{cursor:'pointer', color: 'black'}}>{element.title}</Link>} 
                                                    secondary={
                                                    <>{element.points === null ? 0 : element.points} points by <Link style={{cursor:'pointer'}} underline='hover'>{element.author}</Link>
                                                    &nbsp;|&nbsp; 
                                                    <Link style={{cursor:'pointer', color: 'grey'}} underline='hover'><ReactTimeAgo date={Date.parse(element.created_at)} locale="en-US"/></Link>
                                                    </>
                                                } />
                                            }
                                        </ListItem>
                                    )
                                })
                            }
                        </List>
                    }
                    <div style={{display:'flex',justifyContent:'center', borderTop: '1px solid black'}}>
                        <nav aria-label="Page navigation example">
                            <ul className="pagination">
                                <li className="page-item"><a className="page-link" onClick={this.handleLeft} style={{cursor:'pointer'}}>Previous</a></li>
                                {
                                    this.state.parr.map((value)=>(
                                        value === this.state.currPage ? 
                                        <li className="page-item active" key={value}><a className="page-link" onClick={()=>this.handleClick(value) } style={{cursor:'pointer'}}>{value}</a></li>
                                        :
                                        <li className="page-item" key={value}><a className="page-link" onClick={()=>this.handleClick(value) } style={{cursor:'pointer'}}>{value}</a></li>
                                    ))
                                }
                                <li className="page-item"><a className="page-link" onClick={this.handleRight} style={{cursor:'pointer'}}>Next</a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        )
    }
}

export default Search;