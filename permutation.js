var output = {
    // term: "moritz".toLowerCase(),
    term: "",
    permutations: new Array()
};

(function() {
    const uniques = new Array();
    const doubles = new Map();
    var mask = new Array();

    main();

    function main() {
        check();
        preproccessing(output.term);

        if(uniques.length > 0) {
            heap(uniques.length, uniques);
        } else {
            initPermWithoutUniques([...doubles][0]);
        }

        if(doubles.size > 0) {
            doubles.forEach(function(num, char) {
                if(mask.length) {
                    mask.splice(0, mask.length);
                }
                permuteDouble(
                    genBinaryMask((output.permutations.length ?
                        output.permutations[0].length : 0),
                        num
                ));
                updatePermutations(char);
            });
        }
        // console.log(output.permutations);
    }

    /**
     * checks whether the input value is valid or not
     */
    function check() {
        var invalidChars = /[^A-Za-z]/; // (0-9, &, %)
        while(true) {
            output.term = window.prompt("Enter your name: ").toLowerCase();
            if(!output.term.length) {
                alert("The input was empty. Please enter a name.");
            } else if (output.term.length > 9) {
                alert("The name was too long. Please try another one.");
            } else if (output.term.match(invalidChars)) {
                alert("The name contains invalid characters. " +
                "Please try again.");
            } else {
                break;
            }
        }
    }

    /**
     * fills uniques and doubles collections
     * @param {string} term - the term to permute
     */
    function preproccessing(term) {
        var chars = [...term];
        for(let i = 0; i < chars.length; i++) {
            let count = 1; // counts number of detected characters
            for(j = i+1; j < chars.length; j++) {
                if (chars[i] === chars[j]) {
                    count += 1;
                    chars.splice(j, 1); // delete detected double from array
                    j--;
                }
            }
            if(count === 1) {
                uniques.push(chars[i]);
            } else {
                doubles.set(chars[i], count);
            }
        }
    }

    /**
     * initializes permutations array, if term do not contain
     * any unique character
     * @param {Array.<string, number>} doublesEntry - single entry of
     * doubles map
     */
    function initPermWithoutUniques(doublesEntry) {
        let permutation = new Array();
        doubles.delete(doublesEntry[0]);
        for (let i = 0; i < doublesEntry[1]; i++) {
            permutation.push(doublesEntry[0]);
        }
        output.permutations.push(permutation.join(""));
    }

    /**
     * implementation of heap's algorithm to generate
     * all possible permutations of different objects
     * @param {number} k - number of unique characters to permute
     * @param {Array.<String>} chars - characters to permute
     */
    function heap(k, chars) {
        if(k==1) {
            output.permutations.push(chars.join(""));
        } else {
            heap(k-1, chars);
            for(let i = 0; i < k-1; i++) {
                if(k%2==0) {
                    if(chars[i] == chars[k-1]){
                        continue;
                    }
                    [chars[i], chars[k-1]] = [chars[k-1], chars[i]];
                } else {
                    if(chars[0] == chars[k-1]){
                        continue;
                    }
                    [chars[0], chars[k-1]] = [chars[k-1], chars[0]];
                }
                heap(k-1, chars);
            }
        }
    }

    /**
     * generates a binary array
     * @param {number} numOfZeros - number of already permuted chars
     * @param {number} numOfOnes - number of current double to be permuted
     * @returns array of binary values
     */
    function genBinaryMask(numOfZeros, numOfOnes) {
        var binary = new Array();
        for(let i = 0; i < numOfZeros; i++) {
            binary.push(0);
        }
        for(let i = 0; i < numOfOnes; i++) {
            binary.push(1);
        }
        return binary;
    }

    /**
     * fills mask array
     * @param {Array.<number>} bits - array of binary values
     * @returns
     */
    function permuteDouble(bits) {
        mask.push(Array.from(bits));
        var lastMovableOne = bits.lastIndexOf(1);
        while(bits[lastMovableOne-1] === 1) { // search for last movable 1
            lastMovableOne = lastMovableOne-1;
            if(lastMovableOne <= 0) {
                return;
            }
        }
        var leadingOne = bits.indexOf(1);
        if(leadingOne === lastMovableOne) {
            [bits[leadingOne+1], bits[bits.length-1]] =
                [bits[bits.length-1], bits[leadingOne+1]];
            [bits[leadingOne-1], bits[leadingOne]] =
                [bits[leadingOne], bits[leadingOne-1]];
        }
        else {
            [bits[lastMovableOne-1], bits[lastMovableOne]] =
                [bits[lastMovableOne], bits[lastMovableOne-1]];
                // moves the 1 forward one place
        }
        permuteDouble(bits);
    }

    /**
     * adds permuted character to permutation
     * @param {string} currDouble character that have been permuted
     */
    function updatePermutations(currDouble) {
        updatedPerm = new Array();
        output.permutations.forEach(perm => { // [h, a, a]
            mask.forEach(binElem => { // [0, 0, 1, 1, 0]
                let newPermValue = new Array();
                let countedOnes = 0;
                for (let i = 0; i < binElem.length; i++) { // 0 oder 1
                    if(binElem[i] === 1) {
                        newPermValue.push(currDouble);
                        countedOnes += 1;
                    } else {
                        newPermValue.push(perm[i-countedOnes]);
                    }
                }
                updatedPerm.push(newPermValue.join(""));
            });
        });
        output.permutations = updatedPerm;
    }

})();

window.onload = function() {
    document.getElementById("numOfPermutations").innerHTML =
        "The name \"" + output.term.charAt(0).toUpperCase()
        + output.term.slice(1) + "\" can be permuted "
        + output.permutations.length + " times.";
    document.getElementById("permutations").innerHTML =
    output.permutations.join(" &middot; ");
}