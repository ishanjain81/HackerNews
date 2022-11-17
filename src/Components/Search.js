import React,{Component} from 'react';
import TextField from '@mui/material/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { Link } from '@mui/material';
import ReactTimeAgo from 'react-time-ago';

class Search extends Component {
constructor() {
    super();

    this.state = {
        news: null,
        currPage: 1,
        parr:[1],
        loading: true,
    };
}

    async componentDidMount(){
        const res = await axios.get(`https://hn.algolia.com/api/v1/search?query=`);
        let data = res.data;
        this.setState({
            news: [...data.hits],
            loading: false
        })
        console.log(data.hits[0]);
    }

    render() {
        return(
            <div style={{backgroundColor: 'black',minWidth: '100vw',minHeight: '100vh'}}>
                <div className="home-container" style={{backgroundColor: 'white'}}>
                    <div className="search-page-header">
                        <div className="search-heading">Search <br/> Hacker News</div>
                        <FontAwesomeIcon className="search-icon" icon={faMagnifyingGlass}/>
                        <TextField id="input-with-sx" label="Search Stories by Title, URL or Author" variant="outlined" style={{width: '80%'}} />
                    </div>
                    {
                        this.state.loading === true ? 
                        <CircularProgress/>:
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {
                                this.state.news.map((element,index)=>{
                                    return(
                                        <ListItem key={element.objectID} sx={{paddingTop: 0, paddingBottom: 0}}>
                                            <ListItemAvatar sx={{minWidth: 20, padding: 0, paddingRight: 1}}>
                                                {
                                                    ((this.state.currPage-1) * 30 + index + 1)
                                                }
                                                .
                                            </ListItemAvatar>
                                            <ListItemText primary={
                                                <Link sx={{lineHeight: 'auto'}} underline="none" href={element.url} style={{cursor:'pointer', color: 'black'}}>{element.title}</Link>} 
                                                secondary={
                                                <>{element.points} points by <Link style={{cursor:'pointer'}} underline='hover'>{element.author}</Link>
                                                &nbsp;|&nbsp; 
                                                <Link style={{cursor:'pointer', color: 'grey'}} underline='hover'><ReactTimeAgo date={Date.parse(element.created_at)} locale="en-US"/></Link>
                                                </>
                                            } />
                                        </ListItem>
                                    )
                                })
                            }
                        </List>
                    }
                </div>
            </div>
        )
    }
}

export default Search;