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