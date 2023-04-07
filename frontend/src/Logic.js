import axios from 'axios';
import { author_id_to_number, determine_headers, determine_inbox_endpoint, object_is_local } from './components/helper_functions';




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

async function updateFollowing(authorObject, authstring){
    axios.get(authorObject.id+"/sendrequest/", {headers:{Authorization:'Basic ' + authstring}})
    .then((resp) => {
        // console.log("AUTHORS IM TRYING TO FOLLOW");
        // console.log(resp.data.items);
        var authors_im_trying_to_follow = resp.data.items.filter((oneRequest) => oneRequest.actor.id===authorObject.id)
                                            .filter((oneRequest) => !oneRequest.status)
                                            .map((oneRequest) => oneRequest.object);
        // console.log("AUTHORS IM TRYING TO FOLLOW FILTERED");
        // console.log(authors_im_trying_to_follow);
        for (let i=0; i<authors_im_trying_to_follow.length; i++){
            // get that person's followers\
            axios.get(
                authors_im_trying_to_follow[i].id+'/followers',
                {headers:determine_headers(authors_im_trying_to_follow[i].id)}
            ).then(resp => {
                // if I am in resp.data.items, set the status to true
                // console.log("CHECKING FOLLOWERS OF ");
                // console.log(authors_im_trying_to_follow[i]);
                // console.log(resp.data);
                // console.log(resp.data.items.map(oneAuthor => oneAuthor.id));
                // console.log(authorObject.id);
                // console.log(resp.data.items.map(oneAuthor => oneAuthor.id).includes(authorObject.id));
                // console.log("BODY OF THE REQUEST");
                // console.log(authors_im_trying_to_follow[i]);
                if(resp.data.items.map(oneAuthor => oneAuthor.id).includes(authorObject.id)){
                    // send a put request to the followers endpoint
                    // console.log("YO WHAT THE FUCK");
                    // console.log(resp.data.items[i]);
                    axios.post(
                        authorObject.id+"/sendrequest/",
                        authors_im_trying_to_follow[i],
                        {headers:{Authorization:"Basic " + authstring}}
                    ).then(e => console.log("DONE FOLLOWING")).catch(e => console.log("EPIC FAIL!"));
                }
                // if (resp.data.items.includes()
            });
            // if (object_is_local(authors_im_trying_to_follow[i].id)){
            //     axios.get(authors_im_trying_to_follow[i].id+'/followers/',{headers:determine_headers(authors_im_trying_to_follow[i].id)})
            // }
            // check if I'm in it
            // if yes, set this row in the table to true
        }
    })
}

async function getAuthors(authorObject, authString){
    var total_authors = [];
    try{
        console.log("AUTHORS I ALREADY FOLLOW");
        console.log(authorObject.id, authString);
        var authors_i_follow = await axios.get(authorObject.id+"/sendrequest",{headers:{Authorization: "Basic " + authString}}).then(resp => resp.data.items);
        authors_i_follow = authors_i_follow.map(req => req.object.id);
        console.log("AUTHORS I ALREADY FOLLOW: ", authors_i_follow);

        var local_authors = await axios.get("https://distributed-social-net.herokuapp.com/service/authors");
        local_authors = local_authors.data.items
                            .filter(oneaut => oneaut.id.startsWith("https://distributed-social-net.herokuapp.com/service/authors"))
                            .filter(oneaut => oneaut.host.startsWith("https://distributed-social-net.herokuapp.com"))
                            .filter(oneaut => !authors_i_follow.includes(oneaut.id));
        total_authors = total_authors.concat(local_authors);
        // team 19
        var local_authors_from_team19 = await axios.get(
                "https://floating-fjord-51978.herokuapp.com/authors/",
                {
                    headers: determine_headers("https://floating-fjord-51978.herokuapp.com/authors/")
                });
            local_authors_from_team19 = local_authors_from_team19.data.items
                                            .filter(oneaut => oneaut.id.startsWith("https://floating-fjord-51978.herokuapp.com/authors/"))
                                            .filter(oneaut => oneaut.host.startsWith("https://floating-fjord-51978.herokuapp.com"))
                                            .filter(oneaut => !authors_i_follow.includes(oneaut.id));
        total_authors = total_authors.concat(local_authors_from_team19);
        
        // This is for team 21
        console.log("Fetch from Team 21");
        var local_authors_from_team21 = await axios.get(
            "https://social-distribution-group21.herokuapp.com//service/authors/",
            {
                headers: determine_headers("https://social-distribution-group21.herokuapp.com//service/authors/")
            });
        local_authors_from_team21 = local_authors_from_team21.data.items
                                        .filter(oneaut => oneaut.id.startsWith("https://social-distribution-group21.herokuapp.com//service/authors/"))
                                        .filter(oneaut => oneaut.host.startsWith("https://social-distribution-group21.herokuapp.com/"))
                                        .filter(oneaut => !authors_i_follow.includes(oneaut.id));
        total_authors = total_authors.concat(local_authors_from_team21);
    } catch (error){
        console.log(error);
    } finally {
        return total_authors;
    }
    

    
}


async function gatherAll(authorObject, authString){
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

    await updateFollowing(authorObject, authString); // this doesn't need await
    
    var total_posts = [];
    try {
        var posts_from_inbox = await axios.get(
            authorObject.id+determine_inbox_endpoint(authorObject.id),
            {headers:{Authorization: "Basic " + authString}}
        );
        posts_from_inbox = posts_from_inbox.data.items.filter(inb => inb.type==="post");
        total_posts = total_posts.concat(posts_from_inbox);
        console.log(total_posts);

        var total_authors = [];
        
        console.log("Fetch from ours");
        var local_authors = await axios.get("https://distributed-social-net.herokuapp.com/service/authors");
        local_authors = local_authors.data.items
                            .filter(oneaut => oneaut.id.startsWith("https://distributed-social-net.herokuapp.com/service/authors"))
                            .filter(oneaut => oneaut.host.startsWith("https://distributed-social-net.herokuapp.com"));
        // console.log(local_authors)
        for (let i=0; i<local_authors.length; i++){
            console.log(local_authors[i].displayName);
            var local_post = []
            try {
                var local_post = await axios.get(local_authors[i].id + '/posts/');
                // console.log(local_post.data);
            } catch (error){
                console.log(error)
            } finally {
                total_posts = total_posts.concat(local_post.data.items.filter((onePost) => onePost.visibility==="PUBLIC"));
            }
        }

        // This is for team 21
        console.log("Fetch from Team 21");
        var local_authors_from_team21 = await axios.get(
            "https://social-distribution-group21.herokuapp.com//service/authors/",
            {
                headers: determine_headers("https://social-distribution-group21.herokuapp.com//service/authors/")
            });
        local_authors_from_team21 = local_authors_from_team21.data.items
                                        .filter(oneaut => oneaut.id.startsWith("https://social-distribution-group21.herokuapp.com//service/authors/"))
                                        .filter(oneaut => oneaut.host.startsWith("https://social-distribution-group21.herokuapp.com/"));
        // console.log(local_authors)
        for (let i=0; i<local_authors_from_team21.length; i++){
            try {
                var local_post = await axios.get(
                    local_authors_from_team21[i].id + '/posts',
                    {
                        headers: determine_headers(local_authors_from_team21[i].id)
                    });
                    total_posts = total_posts.concat(local_post.data.posts.filter((onePost) => onePost.visibility==="PUBLIC"));
            } catch (error){
                console.log(error)
            }
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

        // This is for team 19
        console.log("Fetch from Team 19");
        var local_authors_from_team21 = await axios.get(
            "https://floating-fjord-51978.herokuapp.com/authors/",
            {
                headers: determine_headers("https://floating-fjord-51978.herokuapp.com/authors/")
            });
        local_authors_from_team21 = local_authors_from_team21.data.items
                                        .filter(oneaut => oneaut.id.startsWith("https://floating-fjord-51978.herokuapp.com/authors/"))
                                        .filter(oneaut => oneaut.host.startsWith("https://floating-fjord-51978.herokuapp.com"));
        for (let i=0; i<local_authors_from_team21.length; i++){
            try {var local_post = await axios.get(
                local_authors_from_team21[i].id + '/posts',
                {
                    headers: determine_headers(local_authors_from_team21[i].id)
                });
                console.log(local_post);
            total_posts = total_posts.concat(local_post.data.items.filter((onePost) => onePost.visibility==="PUBLIC"));
            } catch (error) {
                console.log(error);
            }
        }
        // filter by public post
        // total_posts = total_posts.filter(onePost => onePost.visibility==="PUBLIC");
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


export {gatherAll, getAuthors};