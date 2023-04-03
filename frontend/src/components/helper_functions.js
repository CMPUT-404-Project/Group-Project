export function author_id_to_number(author_id) {
    // input: http://127.0.0.1:8000/service/authors/078b54264d554d69af4ad92a2ef641e7
    // output: 078b54264d554d69af4ad92a2ef641e7
    return author_id.split('/').pop();
}

export function object_is_local(text){
    // input: http://127.0.0.1:8000/service/authors/47aa211c64264fd3b0cff0fc2401ea32
    // output: True

    
    // input: https://social-distribution-group21.herokuapp.com/service/authors/47aa211c64264fd3b0cff0fc2401ea32
    // output: False
    return text.includes("distributed-social-net.herokuapp.com/");
}

export function determine_headers(url_request){
    if (url_request.includes("floating-fjord-51978.herokuapp.com")){
        // team 19
        return {
            Authorization: "Basic YWRtaW46YWRtaW4="
        }
    } else if (url_request.includes("socialdistcmput404.herokuapp.com")){
        // team 10
        return {
            Authorization: "Token 510A233343210757FB490505AA2E9B52A3D678BF"
        }
    } else if (url_request.includes("social-distribution-group21.herokuapp.com")){
        // team 21 
        return {
            Authorization: "Basic Z3Vlc3Q6Z3Vlc3Q="
            // Authorization: "Token 99074546c54ae7c69e75370467c28d337ea19243"
        }
        
    } else if (url_request.includes("distributed-social-net.herokuapp.com")){
        // our team: team 18
        console.log("you should probably build the string yourself")
        return {}
    } else {
        // return an empty header object
        return {}
    }
}

export function determine_inbox_endpoint(url_request){
    if (url_request.includes("distributed-social-net.herokuapp.com") ||
        url_request.includes("social-distribution-group21.herokuapp.com")){
        // our team: team 18
        console.log("you should probably build the string yourself")
        return "/inbox/"
    } else {
        /**
         * floating-fjord-51978.herokuapp.com: team 19
         * socialdistcmput404.herokuapp.com
         * 
         */
        // return an empty header object
        return "/inbox"
    }
}

// export function determine_posts_endpoint(url_request){
//     if (url_request.includes("floating-fjord-51978.herokuapp.com")){
//         // team 19
//         return {
//             Authorization: "Basic YWRtaW46YWRtaW4="
//         }
//     } else if (url_request.includes("socialdistcmput404.herokuapp.com")){
//         // team 10
//         return {
//             Authorization: "Basic Z3Vlc3Q6Z3Vlc3Q="
//         }
//     } else if (url_request.includes("social-distribution-group21.herokuapp.com")){
//         // team 21 
//         return {
//             Authorization: "Basic Z3Vlc3Q6Z3Vlc3Q="
//         }
        
//     } else if (url_request.includes("distributed-social-net.herokuapp.com")){
//         // our team: team 18
//         console.log("you should probably build the string yourself")
//         return {}
//     } else {
//         // return an empty header object
//         return {}
//     }
// }