const LA = require( './LexicalAnalysis' );
const TokenType = LA.TokenType;
const Logger = require( "./Logger" );
const chalk = require( "chalk" );

function isNumber( token )
{
	return token.type == TokenType.TK_INT || token.type == TokenType.TK_FLOAT;
}

function isOperator( token )
{
	let t = token.type;
	return t == TokenType.TK_PLUS || t == TokenType.TK_MINUS || t == TokenType.TK_MUL || t == TokenType.TK_DIV;
}

class BinaryOpNode
{
	constructor( left, opToken, right )
	{
		if ( !isOperator( opToken ) )
			Logger.Error( "Invalid Binary Operator: " + opToken.type );
		this.left = left;
		this.op = opToken;
		this.right = right;

		if ( opToken.type == TokenType.TK_PLUS )
			this.value = this.left.value + this.right.value;
		else if ( opToken.type == TokenType.TK_MINUS )
			this.value = this.left.value - this.right.value;
		else if ( opToken.type == TokenType.TK_MUL )
			this.value = this.left.value * this.right.value;
		else if ( opToken.type == TokenType.TK_DIV )
			this.value = this.left.value / this.right.value;

		if ( left.type == TokenType.TK_INT && right.type == TokenType.TK_INT )
			this.value = Math.trunc( this.value );
	}
}


/* 
Grammer:
expr    : term ((PLUS|MINUS) term)*

term    : factor ((MUL|DIV) factor)*

factor  : INT|FLOAT
		: (PLUS|MINUS) factor
		: LPAREN expr RPAREN
 */

class Parser
{
	constructor( tokens )
	{
		this.tokens = tokens;
		this.ind = -1;
		// this.advance();
		// console.log(this.tokens);
		this.advance();
	}

	advance()
	{
		this.ind = Math.min( this.ind + 1, this.tokens.length - 1 );
		this.currTok = this.tokens[this.ind];
		// console.log(this.currTok);
		// this.currTok = this.ind < this.tokens.length ? this.tokens[this.ind] : this.tokens[this.tokens.length-1];
		return this.currTok;
	}

	factor()
	{
		let tok = this.currTok;
		this.advance();
		if ( isNumber( tok ) ) return tok;
		if ( tok.type == TokenType.TK_PLUS || tok.type == TokenType.TK_MINUS ) //TODO: Create UnaryOpNode
		{
			let res = this.factor();
			if ( tok.type == TokenType.TK_MINUS )
				res.value = -res.value;
			return res;
		}
		if ( tok.type == TokenType.TK_LPAREN )
		{
			let res = this.expr();
			if ( this.currTok.type == TokenType.TK_RPAREN ) //no error
			{
				this.advance();
				return res;
			}
			else
				Logger.Error( "Missing ')'" );

		}
		if ( tok.type != TokenType.TK_EOF )
			Logger.Error( "Invalid Factor Token: " + tok.type );
	}

	term()
	{
		let left = this.factor();
		let tok = this.currTok;

		while ( tok.type == TokenType.TK_MUL || tok.type == TokenType.TK_DIV )
		{
			this.advance();
			let right = this.factor();
			left = new BinaryOpNode( left, tok, right );
			tok = this.currTok;
		}
		return left;
	}

	expr()
	{
		let left = this.term();
		let tok = this.currTok;

		while ( tok.type == TokenType.TK_PLUS || tok.type == TokenType.TK_MINUS )
		{
			this.advance();
			let right = this.term();
			left = new BinaryOpNode( left, tok, right );
			tok = this.currTok;
		}
		return left;
	}

	parse()
	{
		let res = this.expr();
		// console.log(this.currTok);
		if ( this.currTok.type != TokenType.TK_EOF )
			Logger.Error( "Not EOF" )
		return res;
	}
}

exports.Parser = Parser;
exports.BinaryOpNode = BinaryOpNode;