import axios from 'axios';
import { author_id_to_number, determine_headers } from './components/helper_functions';




async function getGithub(userID){
    console.log("githubActivities");
    console.log(userID);
    let githubActivities = await fetch('https://distributed-social-net.herokuapp.com/service/authors/github/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userID:author_id_to_number(userID.id) })
    }).then(response => response.json())
    console.log(githubActivities);
    return githubActivities;
}


async function gatherAll(authorObject){
    // console.log(authorObject);
    var postsToShare;
    var githubActivities = [];
    try{
        // githubActivities = await getGithub(authorObject);
        // githubActivities = githubActivities.map((item ) => {item.published = item.created_at;return item;})
    } catch (error) {
        console.log("Something went wrong with github.");
        console.log("It's either invalid or rate-limited.");
    }
    
    var total_posts = [];
    try {
        
        
        // console.log(githubActivities);

        var total_authors = [];
        
        var local_authors = await axios.get("https://distributed-social-net.herokuapp.com/service/authors");
        local_authors = local_authors.data.items.filter(oneaut => oneaut.id.startsWith("https://distributed-social-net.herokuapp.com/service/authors"));
        // console.log(local_authors)
        for (let i=0; i<local_authors.length; i++){
            console.log(local_authors[i].displayName);
            var local_post = await axios.get(local_authors[i].id + '/posts/');
            // console.log(local_post.data);
            total_posts = total_posts.concat(local_post.data.items);
        }

        // This is for team 21
        var local_authors_from_team21 = await axios.get(
            "https://social-distribution-group21.herokuapp.com//service/authors/",
            {
                headers: determine_headers("https://social-distribution-group21.herokuapp.com//service/authors/")
            });
        local_authors_from_team21 = local_authors_from_team21.data.items.filter(oneaut => oneaut.id.startsWith("https://social-distribution-group21.herokuapp.com//service/authors/"));
        // console.log(local_authors)
        for (let i=0; i<local_authors_from_team21.length; i++){
            var local_post = await axios.get(
                local_authors_from_team21[i].id + '/posts',
                {
                    headers: determine_headers(local_authors_from_team21[i].id)
                });
            total_posts = total_posts.concat(local_post.data.posts);
        }

        // CORS errors
        // this is for team 10
        // var local_authors_from_team10 = await axios.get(
        //     "https://socialdistcmput404.herokuapp.com/api/authors/",
        //     {
        //         headers: {
        //             Authorization: "Token 510A233343210757FB490505AA2E9B52A3D678BF"
        //         }
        //     }); // ^^^ doesn't work
        // var local_authors_from_team10 = await fetch(
        //         "https://socialdistcmput404.herokuapp.com/api/authors/",
        //         {

        //             mode: "cors",
        //             headers: {
        //                 'Access-Control-Allow-Origin': '*',
        //                 'Accept': '*/*',
        //                 'Accept-Encoding': 'gzip, deflate, br',
        //                 'Authorization': "Token 510A233343210757FB490505AA2E9B52A3D678BF"
        //             },
        //         }
        //     ); // ^^^ doesn't work either
        // local_authors_from_team10 = local_authors_from_team21.data.items;
        // // console.log(local_authors)
        // for (let i=0; i<local_authors_from_team10.length; i++){
        //     var local_post = await axios.get(
        //         local_authors_from_team10[i].id + '/posts',
        //         {
        //             headers: {
        //                 Authorization: "Token 510A233343210757FB490505AA2E9B52A3D678BF"
        //             }
        //         });
        //     total_posts = total_posts.concat(local_post.data.posts);
        // }

        // This is for team 21
        var local_authors_from_team21 = await axios.get(
            "https://floating-fjord-51978.herokuapp.com/authors/",
            {
                headers: determine_headers("https://floating-fjord-51978.herokuapp.com/authors/")
            });
        local_authors_from_team21 = local_authors_from_team21.data.items.filter(oneaut => oneaut.id.startsWith("https://floating-fjord-51978.herokuapp.com/authors/"));
        // console.log(local_authors)
        for (let i=0; i<local_authors_from_team21.length; i++){
            var local_post = await axios.get(
                local_authors_from_team21[i].id + '/posts',
                {
                    headers: determine_headers(local_authors_from_team21[i].id)
                });
                console.log(local_post);
            total_posts = total_posts.concat(local_post.data.items);
        }
        // filter by public post
        total_posts = total_posts.filter(onePost => onePost.visibility==="PUBLIC");
        // combine it with the github activities
        total_posts = total_posts.concat(githubActivities);
        console.log(total_posts);
        // sort it so most recent at the top
        total_posts.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.published) - new Date(a.published);
          });
        return total_posts;

        total_authors = total_authors.concat(local_authors.data.items);

        const res = await axios.get("https://distributed-social-net.herokuapp.com/nodes/");
        let nodes = res.data.nodes;

        // var total_posts = [];
        
        for (var i = 2; i < nodes.length; i++) {
            console.log(nodes[i]);
            var authors_in_one_node;
            let node_headers = {
                'Accept': '*/*',
                // 'Access-Control-Allow-Methods': 'GET, POST',
                // 'Content-Type': 'application/json',
                // 'Access-Control-Allow-Origin': 'socialdistcmput404.herokuapp.com',
            };
            if (nodes[i].auth_token){ // there is an auth token
                node_headers['Authorization'] = nodes[i].auth_token;
            }
            console.log(node_headers);
            // authors_in_one_node = await axios.get(res.data.nodes[i].api_url, {headers:node_headers});
            try {
                // authors_in_one_node = await fetch(res.data.nodes[i].api_url, {
                //     method: 'GET',
                //     headers: node_headers,
                //     mode: 'cors',
                // });
                authors_in_one_node = await axios.get(res.data.nodes[i].api_url, {headers:node_headers}).catch((err) => console.log(err));
                authors_in_one_node = authors_in_one_node.data.items;
                // console.log(authors_in_one_node);
                for (var j = 0; j < authors_in_one_node.length; j++) {
                    console.log(authors_in_one_node[j]);
                    let post_from_one_author = await axios.get(authors_in_one_node[j].id + '/posts/', {headers:node_headers}).catch((err) => console.log(err));
                    console.log(post_from_one_author);
                    post_from_one_author = post_from_one_author.data.posts;
                    total_posts = total_posts.concat(post_from_one_author);
                    
                    console.log(total_posts);
                    // console.log(authors_in_one_node[j]);
                }
            } catch (fetch_error) {
                console.log(fetch_error);
            }
            
            // const authors_in_one_node = await axios.get(res.data.nodes[i].api_url);
            // console.log(authors_in_one_node.data.items);
            total_authors = total_authors.concat(authors_in_one_node.data.items);
            console.log(total_authors);
        }
        console.log("The for-loop ended");
        console.log(total_posts);
    } catch (error) {
        // Handle errors
        console.log(error);
        // combine it with the github activities
        total_posts = total_posts.concat(githubActivities);
        console.log(total_posts);
        // sort it so most recent at the top
        total_posts.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.published) - new Date(a.published);
          });
        return total_posts;
    }

}


export {gatherAll};