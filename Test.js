const LA = require( './LexicalAnalysis' );
const P = require( './Parser' );
const Token = LA.Token;
const TokenType = LA.TokenType;
const Lexer = LA.Lexer;

let T = [
	new Token( TokenType.TK_FLOAT, 8.1 ),
	new Token( TokenType.TK_PLUS ),
	new Token( TokenType.TK_FLOAT, 9.4 ),
];
// console.log(T);

let L = new Lexer( "./input.txt" );
T = L.makeTokens();
let Parser = new P.Parser(T);
console.log(Parser.parse().value);
// console.log( T );

// let B1 = new P.BinaryOpNode(...T);
// let B2 = new P.BinaryOpNode(...T);
// let B3 = new P.BinaryOpNode(B1, new Token(TokenType.TK_MUL), B2)
// console.log(B3);