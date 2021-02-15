const pieces_points = {
    "p": 100,
    "n": 320,
    "b": 333,
    "r": 510,
    "q": 880
}

function custom_kp(pieces, n, d){
    let dp = [];
    for (let l = 0; l <= n; l++){
        let nl = [];
        for (let c = 0; c <= d; c++){
            nl.push(0);
        }
        dp.push(nl);
    }
    dp[0][0] = 1;
    for (let np = 1; np <= n; np++){
        for (let p of pieces){
            for (let i = d; i >= pieces_points[p]; i--){
                dp[np][i] |= dp[np-1][i-pieces_points[p]];
            }
        }
    }
    
    let target;
    let found = false;
    for (target = d; target >= 0; target--){
        if (dp[dp.length-1][target]){
            found = true;
            break;
        }
    }
    if (!found) return null;
    
    let res = [];
    let value = 0;
    for (let lv = n-1; lv >= 0; lv--){
        for (let p of pieces){
            if (target >= pieces_points[p] && dp[lv][target - pieces_points[p]]){
                res.push(p);
                target -= pieces_points[p];
                value += pieces_points[p];
            }
        }
    }
    
    return [res.join("").toUpperCase(), value]
}

function random_fen(){
    const pieces = Object.keys(pieces_points);
    let black = "";
    let white = "";
    let sum_black = 0;
    let sum_white = 0;
    
    for (let i = 0; i < 16; i++){
        if (i == 4){
            black += "k";
        } else if (i == 15 && black.indexOf("q") < 0) {
            black += "q";
            sum_black += pieces_points["q"];
        } else {
            let idx = Math.floor(Math.random()*pieces.length);
            black += pieces[idx];
            sum_black += pieces_points[pieces[idx]];
        }
    }
    
    let new_white = "", sum_white2 = 0;
    while (new_white.length != 8){
        white = "";
        sum_white = sum_white2 = 0;
        for (let i = 0; i < 8; i++){
            if (i == 4){
                white += "K";
            } else {
                let idx = Math.floor(Math.random()*pieces.length);
                white += pieces[idx].toUpperCase();
                sum_white += pieces_points[pieces[idx]];
            }
        }
        
        [new_white, sum_white2] = custom_kp(pieces, 8, sum_black - sum_white);
        sum_white += sum_white2;
    }
    
    return [black.substr(0, 8), black.substr(8, 8), "8/8/8/8", new_white, white].join("/");
}

random_fen();