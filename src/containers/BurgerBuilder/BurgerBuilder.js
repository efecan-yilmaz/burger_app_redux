import React, { Component } from 'react';
import Aux from '../../hoc/Aux2'
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component{
    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false
    }

    updatePurchaseState (ingredients) {
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey]
        }).reduce((sum, el) => {
            return sum + el;
        }, 0);
        this.setState({purchasable: sum > 0});
    }

    addIngredientHandler = (type) => {
        const updatedCount = this.state.ingredients[type] + 1;

        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;

        const newPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const updatedCount = this.state.ingredients[type] - 1;
        
        if(updatedCount < 0) {
            return;
        }

        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;

        const newPrice = this.state.totalPrice - INGREDIENT_PRICES[type];
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true });
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        // alert('You continue!');
        this.setState({loading: true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Efe',
                address: {
                    street: 'Test street 1',
                    zipCode: '10963',
                    country: 'Germany'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order).then(response => {
            this.setState({loading: false, purchasing: false});
        }).catch(error => {
            this.setState({loading: false, purchasing: false});
        });
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = <OrderSummary ingredients={this.state.ingredients} purchaseCanceled={this.purchaseCancelHandler} purchaseContinue={this.purchaseContinueHandler} price={this.state.totalPrice}/>;
        if (this.state.loading) {
            orderSummary = <Spinner />
        }
        return (        
            <Aux>
                <Modal show={this.state.purchasing} modelClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls ingredientAdded={this.addIngredientHandler} 
                    ingredientRemoved={this.removeIngredientHandler} 
                    disabled={disabledInfo} 
                    price={this.state.totalPrice}
                    purchasable={this.state.purchasable}
                    ordered={this.purchaseHandler} />
            </Aux>
        );

    };
}

export default BurgerBuilder

