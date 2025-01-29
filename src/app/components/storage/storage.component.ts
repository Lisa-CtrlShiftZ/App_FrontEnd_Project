import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-storage',
  imports: [],
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css'
})

export class StorageComponent implements OnInit {
  foodList: { name: string; id: number; amount: string; expiration_date: string; calories_per_kilo: number; protein: number; fat: number; carbohydrates: number }[] = []; 

  ngOnInit(): void {
    this.setupFilterListener();
    this.displayStat(0.8, 0.5, 0.3); 
    const food = this.foodRequest("pizza");
    //const userId = localStorage.getItem('user_id');
    //if (!userId) {
    //  return;
    //}
    const userId = 2
    this.getAllFoodData(userId);
    console.log("this is the things collected: ",food)
    this.calorieStats(8000,5000)
    this.calculateStats()
  }

  async foodRequest(query: string): Promise<{ name: string; calories_per_kilo?: number; protein?: number; fat?: number; carbohydrates?: number }[]> {
    const url = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
    const app_id = '37f64774';
    const app_key = '75127a08bd55149fb3131af961244f1d';

    // this is the body i send to the external api, this should be in grams ideally but its not currently
    // const requestBody = { query , serving_size:"serving_weight_grams"};
    const requestBody = { query };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': app_id,
          'x-app-key': app_key,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API call failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log(data)
      return data.foods.map((food: any) => ({
        name: food.name,
        calories_per_kilo: food.nf_calories*(1000/food.serving_weight_grams),
        protein: food.nf_protein*(1000/food.serving_weight_grams),
        fat: food.nf_total_fat*(1000/food.serving_weight_grams),
        carbohydrates: food.nf_total_carbohydrate*(1000/food.serving_weight_grams),
      }));
    } catch (error) {
      console.error('Error fetching food data:', error);
      return [];
    }
  }

  calorieStats(totalCalories: number, currentCalories: number): void {
    const totalCaloriesElement = document.getElementById("total_calories") as HTMLElement;
    const extraCaloriesElement = document.getElementById("extra_calories") as HTMLElement;
    const barCaloriesProgress = document.getElementById("progress_bar_calories") as HTMLElement;
  
    if (totalCaloriesElement) {
      totalCaloriesElement.textContent = `${currentCalories} cal`;
    }
  
    if (extraCaloriesElement) {
      extraCaloriesElement.textContent = `${totalCalories-currentCalories} cal`;
    }
  
    if (barCaloriesProgress) {
      console.log("percentage of calories missing:" + Math.min((totalCalories-currentCalories) / totalCalories, 1) * 100)
      const percentage = Math.min(currentCalories / totalCalories, 1) * 100; 
      barCaloriesProgress.setAttribute('value', `${percentage}`);

    } else {
      console.error("Element with ID 'progress_bar_calories' not found.");
    }
  }
  

  openSelectionWindow(): void {
    const openButton = document.getElementById('openWindow') as HTMLButtonElement;
    const closeButton = document.getElementById('closeWindow') as HTMLElement;
    const displayWindow = document.getElementById('displayWindow') as HTMLElement;

    const showWindow = () => {
      displayWindow.classList.remove('hidden');
    };

    const hideWindow = () => {
      displayWindow.classList.add('hidden');
    };

    openButton.addEventListener('click', showWindow);
    closeButton.addEventListener('click', hideWindow);
  }

  calculateStats(): void{
    let current_storage_calories = 0;
    const total_calories = 2000;
    this.foodList.forEach((food) => {
      
      console.log("this is hte current total we have in storage"+ current_storage_calories, food.calories_per_kilo)
    if (food.calories_per_kilo) {
      current_storage_calories += food.calories_per_kilo; // Accumulate calories
      console.log("this is hte current total we have in storage"+ current_storage_calories)
    }
    console.log("this is hte final total we have in storage"+ current_storage_calories)
    this.calorieStats(8000,total_calories)
    // per 1000 calories you consume ideally you have 25 and 87.5 g of protein, to simplefy we will go with 56.25g for it
    // there are gender and goal specific differences there is currently not enough time to take in account with rightnow
    // source: https://www.liveeatlearn.com/how-many-calories-in-gram-of-protein/
    // second source: https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/
    const total_protein_required = total_calories * ( 56.25 / 1000 )
    console.log("here is the total amount of protein you need: " +total_protein_required)

    // per 1000 calories you consume ideally you have 150g of protein
    // once again there are gender and goal specific differences there is currently not enough time to take in account with rightnow
    // source: https://www.livestrong.com/article/292776-one-gram-of-carbohydrates-has-how-many-calories/
    // second source: https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/
    const total_carb_required = total_calories * ( 150 / 1000 )
    console.log("here is the total amount of carb you need: " +total_carb_required)

    // per 1000 calories you consume ideally you have 20 and 35 g of protein, to simplefy we will go with 27.5g for it
    // once again there are gender and goal specific differences there is currently not enough time to take in account with rightnow
    // source: https://www.verywellhealth.com/how-many-grams-of-fat-per-day-8421874
    // second source: https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/
    // third source: https://www.who.int/news-room/fact-sheets/detail/healthy-diet
    const total_fat_required = total_calories * ( 27.5 / 1000 )
    console.log("here is the total amount of fat you need: " +total_fat_required)
    const current_protein = this.foodList.reduce((total, item) => {
      return total + item.protein * parseFloat(item.amount);
    }, 0);
    console.log("current percentage of protein"+ current_protein)
    const current_carb = this.foodList.reduce((total, item) => {
      return total + item.protein * parseFloat(item.amount);
    }, 0);
    const current_fat = this.foodList.reduce((total, item) => {
      return total + item.protein * parseFloat(item.amount);
    }, 0);

    this.displayStat( current_protein /total_protein_required, current_carb/total_carb_required, current_fat/total_fat_required)
  });
  }

  displayStat(protein_percentage: number,carb_percentage:number,fat_percentage:number): void {
    const circleProtein = document.getElementById("display_amount_of_protein") as HTMLElement;
    const percentageProtein = document.getElementById("protein_percentage")as HTMLElement;
    const circleCarb = document.getElementById("display_amount_of_carb") as HTMLElement;
    const percentageCarb = document.getElementById("carb_percentage")as HTMLElement;
    const circleFat = document.getElementById("display_amount_of_fat") as HTMLElement;
    const percentageFat = document.getElementById("fat_percentage")as HTMLElement;

    if (circleProtein) {
      const strokeDashoffset =251.2- (188.4 * Math.min(protein_percentage,1));
      circleProtein.style.strokeDashoffset = strokeDashoffset.toString();
    } 
    if (percentageProtein) {
      percentageProtein.textContent = `${protein_percentage*100} %`;
    }

    if (circleCarb) {
      const strokeDashoffset =251.2- (188.4 * Math.min(carb_percentage,1));
      circleCarb.style.strokeDashoffset = strokeDashoffset.toString();
    } 

    if (percentageCarb) {
      percentageCarb.textContent = `${carb_percentage*100} %`;
    }

    if (circleFat) {
      const strokeDashoffset =251.2-(188.4 * Math.min(fat_percentage,1));
      circleFat.style.strokeDashoffset = strokeDashoffset.toString();
    } else {
      console.error('Circle element not found!');
    }

    if (percentageFat) {
      percentageFat.textContent = `${fat_percentage*100} %`;
    }
}

  async addFood():Promise<{food_id:number}|undefined>{
    const foodType = (document.getElementById("foodName") as HTMLInputElement).value
    if (!foodType) {
      console.error("No food type entered!");
      return undefined; // Exit if no food type is provided
    }
    try{
    const foodData = await this.foodRequest(foodType)

    if (foodData.length === 0) {
      console.error("No food data returned from API.");
      return undefined;
    }

    const {  carbohydrates, fat, protein,calories_per_kilo } = foodData[0];
    console.log("fetched stats:" +carbohydrates,fat,protein,calories_per_kilo)

    //hardcoded test value
    const user_id = 2

    const food = {
      user_id:user_id,
      food_id:0,
      id:0,
      name: (document.getElementById("foodName") as HTMLInputElement).value,
      amount: (document.getElementById("foodAmount") as HTMLInputElement).value,
      expiration_date: (document.getElementById("foodExpirationDate") as HTMLInputElement).value,
      calories_per_kilo:calories_per_kilo?? 0,
      carbohydrates:carbohydrates?? 0,
      fat: fat?? 0,
      protein: protein ??0
    };

    this.FoodELement(food)
    this.foodList.push(food)
    console.log("this is all the currently displayed food: "+ this.foodList)
    //this part will send the newly added food element to the backend database
    const apiFoodUrl = "http://127.0.0.1:8000/api/food";
    const apiUser_foodUrl = "http://127.0.0.1:8000/api/user_food"

    console.log(JSON.stringify(food));

    const response = await fetch(apiFoodUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(food)
    });
    if (!response.ok) {
    const error = await response.text(); // Capture the server's error message
    console.error(`Server error: ${response.status} - ${error}`);
    return undefined;
  }

  const data = await response.json();
  food.food_id = data.id
  console.log("this is all the data food contains before sending it to the connection: "+ food.food_id,food.user_id, food.amount,food.expiration_date)

  const connectionUserFood = await fetch(apiUser_foodUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(food)
  });
  if (!response.ok) {
  const error = await response.text(); // Capture the server's error message
  console.error(`Server error: ${response.status} - ${error}`);
  return undefined;
}
    const food_id = await response.json();
    return food_id;
    }catch{
      return undefined;
    }
  }
  setupFilterListener(): void {
    const filterDropdown = document.getElementById('filters') as HTMLSelectElement;

    if (filterDropdown) {
      filterDropdown.addEventListener('change', (event: Event) => {
        const selectedValue = (event.target as HTMLSelectElement).value;

        switch (selectedValue) {
          case 'alphabetic':
            this.sortAlphabetically();
            break;
          case 'expiration_date':
            this.sortByExpirationDate();
            break;
          default:
            console.error('Invalid filter selected:', selectedValue);
        }
      });
    } else {
      console.error("Dropdown with ID 'filters' not found!");
    }
  }

  clearList(){
    const container = document.getElementById('storage_container') as HTMLDivElement;

    if (container) {
      container.innerHTML = ''; 
    }
  }
  
  sortAlphabetically() {
    this.foodList.sort((a, b) => a.name.localeCompare(b.name));
    console.log("foodlist:"+this.foodList)
    this.clearList()
    for (const food of this.foodList) {
      this.FoodELement(food);
    }
  }

  //sortByInStorage() {
  //  this.foodList.sort((a, b) => Number(b.owned) - Number(a.owned));
  //  this.renderItems();
  //}

  sortByExpirationDate() {
    this.foodList.sort((a, b) => new Date(a.expiration_date).getTime() - new Date(b.expiration_date).getTime());
    this.clearList()
    console.log(this.foodList)
    for (const food of this.foodList) {
      this.FoodELement(food);
    }
  }

  getAllFoodData(userId:number):void{
    console.log("this function is played")
    

    console.log("userid is correc")
    const foodUserConnections = "http://127.0.0.1:8000/api/user_food"
    let foodConnection: any[] = [];
    
    fetch(foodUserConnections)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`API call failed with status ${response.status}`);
            }
            return response.json(); // Parse the response JSON
        })
        .then((data) => {
            console.log("food has been found", data)
            foodConnection = data.filter((item: any) => item.user_id === userId).map((item: any) => {
              // Renaming here to name to name so it can be used everywhere as just name
              return {
                  ...item,
                  name: item.food_name, 
                  food_name: undefined 
              };
          });
            foodConnection.forEach((food) => {
              // Log each food item's details to verify
             this.FoodELement(food)
             this.foodList.push(food)
             this.calculateStats()
              console.log(`Food Item - User ID: ${food.user_id}, Expiration Date: ${food.expiration_date},everything:${food.name},whatever ${food.id}`);
          });
        }
      )
  }
  async delete_food(id:number):Promise<void>{
    
    const foodUserConnections = `http://127.0.0.1:8000/api/user_food/${id}`
    try {
      const response = await fetch(foodUserConnections, {
          method: "DELETE",
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }

      console.log("Food deleted successfully");
  } catch (error) {
      console.error("Failed to delete food:", error);
  }
  }
  async update_food(foodId: number, newAmount: string, newExpiration: string):Promise<void>{
    
  }
  FoodELement(food: { name: string; amount: string; expiration_date: string,id:number }): void {
    console.log('AddBox function triggered');
    const container = document.getElementById('storage_container') as HTMLDivElement;

    if (container) {
        // Create a container for each food element
        const storageElement = document.createElement('div');
        storageElement.id = 'storage_element';
        storageElement.className = 'storage_element'

        // Create a wrapper for food details
        const foodDetails = document.createElement('div');
        foodDetails.className = 'food-details';

        const foodExtraData = document.createElement("div")
        foodExtraData.className = "food-extra-data"

        const foodNameLabel = document.createElement("label");
        foodNameLabel.textContent = food.name;
        foodNameLabel.className = 'food-name';

        const foodAmountLabel = document.createElement("label");
        foodAmountLabel.textContent = food.amount;
        foodAmountLabel.className = 'food-amount';

        const foodExpirationLabel = document.createElement("label");
        foodExpirationLabel.textContent = food.expiration_date;
        foodExpirationLabel.className = 'food-expiration';
        
        foodDetails.appendChild(foodNameLabel);
        foodExtraData.appendChild(foodAmountLabel);
        foodExtraData.appendChild(foodExpirationLabel);
        foodDetails.appendChild(foodExtraData)
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        // Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-button';
        editButton.addEventListener('click', () => {
            const newAmount = prompt('Enter new amount', food.amount);
            const newExpiration = prompt('Enter new expiration date', food.expiration_date);
            if (newAmount || newExpiration) {
              // Update UI
              if (newAmount) foodAmountLabel.textContent = newAmount;
              if (newExpiration) foodExpirationLabel.textContent = newExpiration;
      
              // Send update request to API
              this.update_food(food.id, newAmount || food.amount, newExpiration || food.expiration_date);
          }
        });

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => {
            container.removeChild(storageElement);
            console.log(food.id)
            this.delete_food(food.id)
        });

        // Append buttons to the button container
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        // Append everything to the storage element
        storageElement.appendChild(foodDetails);
        storageElement.appendChild(buttonContainer);

        // Append the storage element to the main container
        container.appendChild(storageElement);

        console.log('Food element added:', food);
    } else {
        console.error('Target div not found!');
    }
  }
}


