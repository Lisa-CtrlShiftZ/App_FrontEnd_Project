import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-storage',
  imports: [],
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css'
})

export class StorageComponent implements OnInit {
  foodList: { food_name: string; amount: string; expiration_date: string;calories_per_kilo: number; protein: number; fats: number; carbs: number }[] = []; 

  ngOnInit(): void {
    this.setupFilterListener();
    this.displayStat(0.8, 0.5, 0.3); 
    const food = this.foodRequest("pizza");
    this.getAllFoodData();
    console.log("this is the things collected: ",food)
    this.calorieStats(8000,5000)
    this.calculateStats()
  }

  async foodRequest(query: string): Promise<{ food_name: string; calories_per_kilo?: number; protein?: number; fats?: number; carbs?: number }[]> {
    const url = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
    const app_id = '37f64774';
    const app_key = '75127a08bd55149fb3131af961244f1d';

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

      return data.foods.map((food: any) => ({
        name: food.food_name,
        calories: food.nf_calories,
        protein: food.nf_protein,
        fats: food.nf_total_fat,
        carbs: food.nf_total_carbohydrate,
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

    this.foodList.forEach((food) => {
      
      console.log("this is hte current total we have in storage"+ current_storage_calories, food.calories_per_kilo)
    if (food.calories_per_kilo) {
      current_storage_calories += food.calories_per_kilo; // Accumulate calories
      console.log("this is hte current total we have in storage"+ current_storage_calories)
    }
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
      const strokeDashoffset =251.2- (188.4 * protein_percentage);
      circleProtein.style.strokeDashoffset = strokeDashoffset.toString();
    } 
    if (percentageProtein) {
      percentageProtein.textContent = `${protein_percentage*100} %`;
    }

    if (circleCarb) {
      const strokeDashoffset =251.2- (188.4 * carb_percentage);
      circleCarb.style.strokeDashoffset = strokeDashoffset.toString();
    } 

    if (percentageCarb) {
      percentageCarb.textContent = `${carb_percentage*100} %`;
    }

    if (circleFat) {
      const strokeDashoffset =251.2-(188.4 * fat_percentage);
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

    const {  carbs, fats, protein,calories_per_kilo } = foodData[0];

    const food = {
      food_name: (document.getElementById("foodName") as HTMLInputElement).value,
      amount: (document.getElementById("foodAmount") as HTMLInputElement).value,
      expiration_date: (document.getElementById("foodExpirationDate") as HTMLInputElement).value,
      calories_per_kilo:calories_per_kilo?? 0,
      carbs:carbs?? 0,
      fats: fats?? 0,
      protein: protein ??0
    };
    this.FoodELement(food)
    this.foodList.push(food)
    console.log("this is all the currently displayed food: "+ this.foodList)
    //this part will send the newly added food element to the backend database
    const apiUrl = "http://127.0.0.1:8000/api/food";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(food)
    });
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
          case 'in_storage':
            //this.sortByInStorage();
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
    this.foodList.sort((a, b) => a.food_name.localeCompare(b.food_name));
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

  getAllFoodData():void{
    console.log("this function is played")
    //const userId = localStorage.getItem('user_id');
    //if (!userId) {
    //  return;
    //}
    const userId = 2
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
            // Filter the data to include only items with the matching user ID
            console.log("food has been found", data)
            foodConnection= data.filter((item: any) => item.user_id === userId);
            console.log("food has been found", foodConnection.length)
            // Display the filtered data
            const container = document.getElementById('storage_container') as HTMLDivElement;
            if (!container) {
                console.error('Storage container not found!');
                return;
            }
            foodConnection.forEach((food) => {
              // Log each food item's details to verify
             this.FoodELement(food)
             this.foodList.push(food)
             this.calculateStats()
              console.log(`Food Item - User ID: ${food.user_id}, Expiration Date: ${food.expiration_date},everything:${food.food_name}`);
          });
        }
      )
  }


  FoodELement(food: { food_name: string; amount: string; expiration_date: string }): void {
    console.log('AddBox function triggered');
    const container = document.getElementById('storage_container') as HTMLDivElement;

    if (container) {
        // Create a container for each food element
        const storageElement = document.createElement('div');
        storageElement.id = 'storage_element';

        // Create a wrapper for food details
        const foodDetails = document.createElement('div');
        foodDetails.className = 'food-details';

        const foodExtraData = document.createElement("div")
        foodExtraData.className = "food-extra-data"

        const foodNameLabel = document.createElement("label");
        foodNameLabel.textContent = food.food_name;
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
            if (newAmount) foodAmountLabel.textContent = newAmount;
            if (newExpiration) foodExpirationLabel.textContent = newExpiration;
        });

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => {
            container.removeChild(storageElement);
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


