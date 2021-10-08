const Logger = require( "./Logger" );
// const util = require("util");
const fs = require( "fs" );
const chalk = require( "chalk" );

function isDigit( character )
{
	return character >= '0' && character <= '9';
}

//Constants
const TokenType = {
	TK_INT: "INT",
	TK_FLOAT: "FLOAT",
	TK_PLUS: "PLUS",
	TK_MINUS: "MINUS",
	TK_MUL: "MUL",
	TK_DIV: "DIV",
	TK_POW: "POW",
	TK_LPAREN: "LPAREN",
	TK_RPAREN: "RPAREN",
	TK_EOF: "EOF",
};

class Token
{
	/**
	 * @param {TokenType} type The Type of Token
	 * @param value The value of the token (optional)
	 */
	constructor( type, value = null )
	{
		this.type = type;
		this.value = value;
		let INVALID_TOKEN_VALUE = false;
		if ( value == null )
		{
			if ( type == TokenType.TK_FLOAT || type == TokenType.TK_INT )
				INVALID_TOKEN_VALUE = true;
		}
		else
		{
			if ( !( type == TokenType.TK_FLOAT || type == TokenType.TK_INT ) )
				INVALID_TOKEN_VALUE = true;
			if ( Number.isNaN( value ) )
				INVALID_TOKEN_VALUE = true;
			//Check Value type
			// if ( Number.isInteger( value ) && ( type != TokenType.TK_INT && type != TokenType.TK_FLOAT ) )
			// 	INVALID_TOKEN_VALUE = true;
			// else if ( !Number.isInteger( value ) && type == TokenType.TK_INT )
			// 	INVALID_TOKEN_VALUE = true;
		}
		if ( INVALID_TOKEN_VALUE )
		{
			// console.error(
			// 	"%sInvalid Token Value: Token { type: %s, value: %s }",
			// 	chalk.red("[ERROR]: "),
			// 	chalk.green("'" + this.type + "'"),
			// 	chalk.red(this.value)
			// );
			Logger.Error(
				"Invalid Token Value: Token { type: " +
				chalk.green( "'" + this.type + "'" ) +
				", value: " +
				chalk.red( this.value ) +
				" }"
			);
		}
	}
}

class Lexer
{
	constructor( filepath )
	{
		//Sync
		try
		{
			this.text = fs.readFileSync( filepath, "utf8" );
		} catch ( e )
		{
			Logger.Error( e.stack.substring( 7 ) );
			// console.log("", e.stack);
		}
		// console.log(this.text);
		this.pos = -1;
		this.currChar = null;
		this.advance();
	}
	advance()
	{
		++this.pos;
		this.currChar =
			this.pos < this.text.length ? this.text[this.pos] : null;
	}

	makeNumber()
	{
		let dotCount = 0;
		let numStr = '';
		while ( this.currChar && ( isDigit( this.currChar ) || this.currChar == '.' ) )
		{
			if ( this.currChar == '.' )
			{
				++dotCount;
				if ( dotCount > 1 )
					Logger.Error( "Too many decimal places found in Number Literal" )
			}
			numStr += this.currChar;
			this.advance();
		}
		if ( dotCount == 0 )
			return new Token( TokenType.TK_INT, parseInt( numStr ) )
		else
		{
			console.log( "Float" );
			return new Token( TokenType.TK_FLOAT, parseFloat( numStr ) );
		}
	}

	makeTokens()
	{
		let tokens = [];
		const WHITESPACES = " \t\n\r";
		while ( this.currChar )
		{
			if ( WHITESPACES.indexOf( this.currChar ) != -1 ) this.advance();
			else if ( isDigit( this.currChar ) )
				tokens.push( this.makeNumber() );
			else if ( this.currChar == "+" )
			{
				tokens.push( new Token( TokenType.TK_PLUS ) );
				this.advance();
			}
			else if ( this.currChar == "-" )
			{
				tokens.push( new Token( TokenType.TK_MINUS ) );
				this.advance();
			}
			else if ( this.currChar == "*" )
			{
				tokens.push( new Token( TokenType.TK_MUL ) );
				this.advance();
			}
			else if ( this.currChar == "/" )
			{
				tokens.push( new Token( TokenType.TK_DIV ) );
				this.advance();
			}
			else if ( this.currChar == "^" )
			{
				tokens.push( new Token( TokenType.TK_POW ) );
				this.advance();
			}
			else if ( this.currChar == "(" )
			{
				tokens.push( new Token( TokenType.TK_LPAREN ) );
				this.advance();
			}
			else if ( this.currChar == ")" )
			{
				tokens.push( new Token( TokenType.TK_RPAREN ) );
				this.advance();
			}
			else
			{
				//Error
				Logger.Error( "Illegal Character: '" + this.currChar + "'" );
			}
		}
		tokens.push( new Token( TokenType.TK_EOF ) );
		return tokens;
	}
}

exports.Token = Token;
exports.TokenType = TokenType;
exports.Lexer = Lexer;
