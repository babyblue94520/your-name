export class Asserts {
    /**
     * " existed"
     */
	public static readonly Existed = ' existed';
	/**
	 * " does not exist"
	 */
	public static readonly DoesNotExist = ' does not exist';
	/**
	 * " can't be empty"
	 */
	public static readonly NotEmptyMessage = ' can\'t be empty';
	/**
	 * " can't be null"
	 */
	public static readonly NotNullMessage = ' can\'t be null';
	/**
	 * " can't be greater than "
	 */
	public static readonly NotGreaterMessage = ' can\'t be greater than ';
	/**
	 * " can't be less than "
	 */
	public static readonly NotLessMessage = ' can\'t be less than ';
	/**
	 * " can't be same"
	 */
	public static readonly CanNotSame = ' can\'t be same';
	/**
	 * " can't be same"
	 */
	public static readonly NotSame = ' are not the same';


	/**
	 *
	 * notEmpty
	 * 不能為Empty
	 * @param str
	 * @param message
	 * @throws
	 */
	public static notEmpty(str: string, message: string) {
		if (str == null || str == '') {
			throw new Error(message);
		}
	}

	/**
	 *
	 * notNull
	 * 不能為Null
	 * @param object
	 * @param message
	 * @throws
	 */
	public static notNull(value: any, message: string) {
		if (value == null) {
			throw new Error(message);
		}
	}

	/**
	 *
	 * notGreater
	 * 不能大於
	 * @param value
	 * @param target
	 * @param message
	 * @throws
	 */
	public static notGreater(value: number, target: number, message: string) {
		if (value > target) {
			throw new Error(message);
		}
	}

	/**
	 *
	 * less
	 * 不能小於
	 * @param value
	 * @param target
	 * @param message
	 * @throws
	 */
	public static notLess(value: number, target: number, message: string) {
		if (value < target) {
			throw new Error(message);
		}
	}

	/**
	 *
	 * notEquals
	 * 不能等於
	 * @param value
	 * @param target
	 * @param message
	 * @throws
	 */
	public static notEquals(value, target, message: string) {
		if (value == null) {
			if (value == target) {
				throw new Error(message);
			}
		} else {
			if (value === target) {
				throw new Error(message);
			}
		}
	}


	/**
	 *
	 * isEquals
	 * 等於
	 * @param value
	 * @param target
	 * @param message
	 * @throws
	 */
	public static isEquals(value, target, message: string) {
		if (value == null) {
			if (value != target) {
				throw new Error(message);
			}
		} else {
			if (value !== target) {
				throw new Error(message);
			}
		}
	}

	/**
	 *
	 * isTrue
	 * 為真
	 * @param expression
	 * @param message
	 * @throws
	 */
	public static isTrue(expression: boolean, message: string) {
		if (!expression) {
			throw new Error(message);
		}
	}

	/**
	 *
	 * isFalse
	 * 為假
	 * @param expression
	 * @param message
	 * @throws
	 */
	public static isFalse(expression: boolean, message: string) {
		if (expression) {
			throw new Error(message);
		}
	}
}

