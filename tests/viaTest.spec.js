const {test, expect, devices,request}=require('@playwright/test');
const credentials=JSON.parse(JSON.stringify(require('./Data/taskData.json')));
test('login test',async ({browser})=>{
        const context=await browser.newContext();
        const page=await context.newPage();
        await page.goto('https://dev-via.outamationlabs.com/');
        await page.locator('[type="email"]').fill(credentials.email);
        await page.locator('[type="submit"]').click();
        await page.locator('[type="password"]').fill(credentials.password);
        await page.locator('[type="submit"]').click();
        await page.locator('.displaySign').waitFor();
        // console.log("Verification number "+await page.locator('.displaySign').textContent());
        await page.locator('[type="checkbox"]').click();
        await page.locator('[type="submit"]').click();
        await page.locator('.align-items-center').first().waitFor();
        const url=await page.url();
        // console.log("Current url is "+url);
        await expect(url.includes('dashboard')).toBeTruthy();
        console.log("Your role is "+await page.locator('.via-input-txt').first().textContent());
        await context.storageState({path:'via.json'});
    })
test('Workflow component',async({browser})=>{
    const context=await browser.newContext({storageState:'via.json'});
    const page=await context.newPage();
    await page.goto('https://dev-via.outamationlabs.com/');
    
    //code for viaWorks
    await page.locator('[aria-label="viaWorks"]').click();

    console.log('Workflow Components Flow is as below:\n\n')
    await page.locator('[aria-label="Workflow Components"]').click();
    await expect(page.locator('p-toastitem')).not.toBeAttached().then(
        async (onfulfilled)=>{
            //code for step library
           console.log('Step Library Flow is as below:\n')
           await page.locator('a[role="tab"]').nth(2).click();
           await expect(page.locator('p-toastitem')).not.toBeAttached().then(
                async (onfulfilled)=>{
                    //add step code start
                    // console.log(await page.url());
                    console.log('\n1. Step Creation:');
                    await page.locator('[ng-reflect-label="Add Step"]').click();
                    const testStepName='demo'+Math.floor(Math.random()*1000);
                    const testCaseType='Eviction';
                    await page.locator('#stepName').fill(testStepName);
                    await page.locator('.p-multiselect-trigger').click();
                    await page.locator('[role="searchbox"]').fill(testCaseType);
                    await page.locator('.p-multiselect-items-wrapper li').first().click();
                    // await page.waitForLoadState('networkidle');
                    // console.log(await page.url());
                    await Promise.all([
                        page.waitForURL('https://dev-via.outamationlabs.com/via-ui/#/app/workflow-management/step-properties/*'),
                        page.locator('[label="Submit"]').click(),
                        page.waitForTimeout(3000),
                      ]);
                    const url=await page.url();
                    if(url.includes('step-properties')){
                        console.log('Success - Step Created Successfully')
                    }
                    else{
                        await expect(await page.locator('p-toastitem')).toBeAttached().then(
                            async (onfulfilled)=>{
                                console.log('Failure - Step Not Created ' )
                            },
                            (error)=>{
                                console.log('Somthing went wrong!!');
                            } 
                        );
                    }
                    await page.locator('[ng-reflect-label="Next"]').click();
                    await page.locator('[ng-reflect-label="Next"]').click();
                    await page.locator('[ng-reflect-label="Next"]').click();
                    await page.locator('[ng-reflect-label="Submit"]').click();
                    //add step code end
                    
                    //verify step added properly
                    // const testStepName='demo10';
                    // const testCaseType='Eviction';
                    console.log('\nStep Details Verifying after Step Creation:');
                    await page.locator('[placeholder="Search keyword"]').fill(testStepName);
                    await page.waitForTimeout(1000);
                    await page.locator('[row-index="0"]').first().locator('[col-id="stepName"] a').textContent().then(
                        async (searchedStepName)=>{
                    // const searchedStepName=await page.locator('[row-index="0"]').first().locator('[col-id="stepName"] a').textContent();
                    if(searchedStepName.trim()===testStepName){
                        const searchedCaseType=await page.locator('[row-index="0"]').first().locator('[col-id="caseType"]').textContent();
                        if(searchedCaseType.trim()===testCaseType){
                            const searchedStatus=await page.locator('[row-index="0"]').first().locator('[col-id="isActive"] .p-chip-text').textContent();
                            if(searchedStatus.trim()==='Active'){
                                console.log('Success - Step Details Verified from Grid');
                            }
                            else{
                                console.log('Failure - Step Details Verification from grid for status is Unsuccessful')
                            }
                        }
                        else{
                            console.log('Failure - Step Details Verification from grid for case type is Unsuccessful')
                        }
                    }
                    else{
                        console.log('Failure - Step Details Verification from grid for step name is Unsuccessful')
                    }
                });
                    //update step code start
                    console.log('\n2. Step Edit:');
                    const updatedTestStepName = 'demo' + Math.floor(Math.random() * 1000);
                    const updatedTestCaseType = 'Bankruptcy';
                    await page.locator('[placeholder="Search keyword"]').fill(testStepName);
                    await expect(page.locator('[row-index="0"]').first().locator('[col-id="stepName"] a')).toContainText(testStepName).then(
                        async(onfulfilled)=>{
                            await page.locator('[row-index="0"]').last().click();
                            await page.locator('[role="menu"] [aria-label="Edit"]').click();
                            await page.waitForTimeout(1000);
                            await page.locator('#stepName').clear();
                            await page.locator('#stepName').fill(updatedTestStepName);
                            await page.locator('.p-multiselect-trigger').click();
                            await page.locator('[role="searchbox"]').fill(updatedTestCaseType);
                            await page.locator('.p-multiselect-items-wrapper li').first().click();
                            // await page.pause();
                            await page.locator('[label="Submit"]').click();
                            await page.locator('[ng-reflect-label="Next"]').click();
                            await page.locator('[ng-reflect-label="Next"]').click();
                            await page.locator('[ng-reflect-label="Next"]').click();
                            await page.locator('[ng-reflect-label="Submit"]').click();
                            await expect(page.locator('p-toastitem')).toBeAttached().then(
                                async (onfulfilled) => {
                                    await page.locator('.p-toast-summary').textContent().then(
                                        async (message) => {
                                            if (message.trim() == 'Error') {
                                                console.log('Failure - Step Not Updated '  )
                                            }
                                            else {
                                                console.log('Success - Step Updated Successfully '  )
                                            }
                                        },
                                        (error) => {

                                        }
                                    )
                                },
                                (error) => {
                                    console.log('Failure - Step Not Updated')
                                }
                            );
                        },
                        (error)=>{
                            console.log('Failure - Step Not Updated  step does not exist')
                        }
                    );
                    


                    //verify updated step
                    console.log('\nStep Details Verifying after Step Edit:');
                    await page.locator('[placeholder="Search keyword"]').fill(updatedTestStepName);
                    await page.waitForTimeout(1000);
                    await page.locator('[row-index="0"]').first().locator('[col-id="stepName"] a').textContent().then(
                        async (searchedUpdatedStepName)=>{
                            // console.log(searchedUpdatedStepName);
                            if(searchedUpdatedStepName.trim()===updatedTestStepName){
                                // console.log('Success - Step Updated Successfully');
                                const searchedUpdatedCaseType=await page.locator('[row-index="0"]').first().locator('[col-id="caseType"]').textContent();
                                const temp=testCaseType+','+updatedTestCaseType;
                                if(searchedUpdatedCaseType.trim()===temp){
                                    const searchedUpdatedStatus=await page.locator('[row-index="0"]').first().locator('[col-id="isActive"] .p-chip-text').textContent();
                                    if(searchedUpdatedStatus.trim()==='Active'){
                                        console.log('Success - Updated Step Details Verified from Grid');
                                    }
                                    else{
                                        console.log('Failure - Step Details Verification from grid for status is Unsuccessful')
                                    }
                                }
                                else{
                                    console.log('Failure - Step Details Verification from grid for case type is Unsuccessful')
                                }
                            }
                            else{
                                console.log('Failure - Step Details Verification from grid for step name is Unsuccessful');
                                console.log('Failure - Step Not Updated');
                            }
                        },
                        (error)=>{
                            console.log('Failure - Step Status Not Updated  Step does not exist')
                        }
                    );
                   
                     //change status code
                     console.log('\n3. Step Status:')
                     await page.waitForTimeout(1000);
                     await page.locator('[placeholder="Search keyword"]').fill(updatedTestStepName);
                     await expect(page.locator('[row-index="0"]').first().locator('[col-id="stepName"] a')).toContainText(updatedTestStepName).then(
                         async (onfulfilled) => {
                             await page.locator('[row-index="0"]').last().click();
                             await page.locator('[role="menu"] [aria-label="Set as Inactive"]').click();
                             await expect(page.locator('p-toastitem')).toBeAttached().then(
                                 async (onfulfilled) => {
                                     await page.locator('.p-toast-summary').textContent().then(
                                         async (message) => {
                                             if (message.trim() == 'Error') {
                                                 console.log('Failure - Step Status Not Updated '  )
                                             }
                                             else {
                                                await page.waitForTimeout(1000);
                                                const searchedUpdatedStatus=await page.locator('[row-index="0"]').first().locator('[col-id="isActive"] .p-chip-text').textContent();
                                                if(searchedUpdatedStatus=='Inactive') 
                                                    console.log('Success - Step Status Updated Successfully '  )
                                             }
                                         },
                                         (error) => {
                                             console.log('Failure - Step Not Status Not Updated')
                                         }
                                     )
                                 },
                                 (error) => {
                                     console.log('Failure - Step Not Deleted')
                                 }
                             );
                         },
                         (error) => {
                             console.log('Failure - Step Status Not Updated  Step does not exist')
                         }
                     );
 

                    //delete step code start
                    console.log('\n4. Step Delete:')
                    await page.waitForTimeout(1000);
                    await page.locator('[placeholder="Search keyword"]').fill(updatedTestStepName);
                    await expect(page.locator('[row-index="0"]').first().locator('[col-id="stepName"] a')).toContainText(updatedTestStepName).then(
                        async (onfulfilled) => {
                            await page.locator('[row-index="0"]').last().click();
                            await page.locator('[role="menu"] [aria-label="Delete"]').click();
                            await expect(page.locator('p-toastitem')).toBeAttached().then(
                                async (onfulfilled) => {
                                    await page.locator('.p-toast-summary').textContent().then(
                                        async (message) => {
                                            if (message.trim() == 'Error') {
                                                console.log('Failure - Step Not Deleted '  )
                                            }
                                            else {
                                                console.log('Success - Step Deleted Successfully '  )
                                            }
                                        },
                                        (error) => {
                                            console.log('Failure - Step Not Deleted')
                                        }
                                    )
                                },
                                (error) => {
                                    console.log('Failure - Step Not Deleted')
                                }
                            );
                        },
                        async (error) => {
                            console.log('Failure - Step Not Deleted  Step does not exist')
                        }
                    );
                    
                   
                },async (reson)=>{
                   console.log('Failure on opening step library ' );                
                   }
           );

           //code for sub process
           console.log('\n\nSub-Process Library Flow is as below:\n')
           await page.locator('a[role="tab"]').nth(1).click();
           await expect(page.locator('p-toastitem')).not.toBeAttached().then(
            async (onfulfilled)=>{
                //code for creating sub-process start
                console.log('1. Sub-Process Creation:')
                await page.locator('[ng-reflect-label="Add Sub-Process"]').click();
                // const testProcessName='demo2';
                const testProcessName='demo'+Math.floor(Math.random()*1000);
                const testProcessCase='Eviction';
                await page.locator('#name').fill(testProcessName);
                await page.locator('[formcontrolname="caseType"]').click();
                await page.locator('.p-dropdown-filter').fill(testProcessCase);
                await page.locator('.p-dropdown-item').first().click();
                await page.locator('[label="Submit"]').click();
                await expect(page.locator('p-toastitem')).toBeAttached().then(
                     async (onfulfilled)=>{
                        await page.locator('.p-toast-summary').textContent().then(
                            async (message)=>{
                                if(message.trim()=='Error'){
                                    console.log('Failure - Sub-Process Not Created ' )
                                }
                                else{
                                    console.log('Success - Sub-Process Created Successfully ' )
                                }
                            },
                            (error)=>{

                            }
                        )
                    },  
                     (error)=>{
                        console.log('Failure - Sub-Process Not Created')
                    }
                )

                //verifying process
                console.log('\nSub-Process Details Verifying after Sub-Process Creation:');
                await page.locator('[placeholder="Search keyword"]').fill(testProcessName);
                // await page.pause();
                await expect(page.locator('[row-index="0"]').first().locator('[col-id="name"] a')).toContainText(testProcessName).then(
                    async (onfulfilled)=>{
                        const searchedCaseType=await page.locator('[row-index="0"]').first().locator('[col-id="customProperties.caseType"]').textContent();
                            if(searchedCaseType.trim()==testProcessCase){
                                const isUnpublished=await page.locator('[row-index="0"]').first().locator('[status="Unpublished"]').isVisible();
                                const isActive=await page.locator('[row-index="0"]').first().locator('[status="Active"]').isVisible();
                                const isNew=await page.locator('[row-index="0"]').first().locator('[status="New"]').isVisible();
                                if(isActive && isNew && isUnpublished){
                                    console.log('Success - Sub-Process Details Verified from Grid');
                                }
                                else{
                                    console.log('Failure - Sub-Process Details Verification with status from grid Unsuccessful');
                                }
                            }
                            else{
                            console.log('Failure - Sub-Process Details Verification with case from grid Unsuccessful');
                            }
                    },
                     (error)=>{
                        console.log('Failure - Sub-Process Details Verification with name from grid Unsuccessful')
                    }
                );

                // //update process code start
                console.log('\n2. Sub-Process Edit: ');
                await page.locator('[placeholder="Search keyword"]').fill(testProcessName);
                const updatedProcessName='demo'+Math.floor(Math.random()*1000);
                const updatedProcessCase='Bankruptcy';
                // await page.locator('[placeholder="Search keyword"]').press('Enter');
                await expect(page.locator('[row-index="0"]').first().locator('[col-id="name"] a')).toContainText(testProcessName).then(
                    async(onfulfilled)=>{
                        await page.locator('[row-index="0"]').last().click();
                        await page.locator('[role="menu"] [aria-label="Edit"]').click();
                        await page.waitForTimeout(1000);
                        await page.locator('#name').clear();
                        await page.locator('#name').fill(updatedProcessName);
                        await page.locator('[formcontrolname="caseType"]').click();
                        await page.locator('.p-dropdown-filter').fill(updatedProcessCase);
                        await page.locator('.p-dropdown-item').first().click();
                        await page.locator('[label="Submit"]').click();
                        await expect(page.locator('p-toastitem')).toBeAttached().then(
                            async (onfulfilled)=>{
                                await page.locator('.p-toast-summary').textContent().then(
                                    async (message) => {
                                        if (message.trim() == 'Error') {
                                            console.log('Failure - Sub-Process Not Updated '  )
                                        }
                                        else {
                                            console.log('Success - Sub-Process Updated Successfully '  )
                                        }
                                    },
                                    (error) => {
        
                                    }
                                )
                            },
                            (error) => {
                                console.log('Failure - Sub-Process Not Updated')
                            }
                        );
                    },
                    (error)=>{
                        console.log('Failure - Sub-Process Not Updated')
                    }
                );
                

                console.log('\nSub-Process Details Verifying after Sub-Process Updation:');
                await page.locator('[placeholder="Search keyword"]').fill(updatedProcessName);
                // await page.pause();
                await expect(page.locator('[row-index="0"]').first().locator('[col-id="name"] a')).toContainText(updatedProcessName).then(
                    async (onfulfilled)=>{
                        const searchedCaseType=await page.locator('[row-index="0"]').first().locator('[col-id="customProperties.caseType"]').textContent();
                            if(searchedCaseType.trim()==updatedProcessCase){
                                const isUnpublished=await page.locator('[row-index="0"]').first().locator('[status="Unpublished"]').isVisible();
                                const isActive=await page.locator('[row-index="0"]').first().locator('[status="Active"]').isVisible();
                                const isNew=await page.locator('[row-index="0"]').first().locator('[status="New"]').isVisible();
                                if(isActive && isNew && isUnpublished){
                                    console.log('Success - Sub-Process Details Verified from Grid');
                                }
                                else{
                                    console.log('Failure - Sub-Process Details Verification with status from grid Unsuccessful');
                                }
                            }
                            else{
                            console.log('Failure - Sub-Process Details Verification with case from grid Unsuccessful');
                            }
                    },
                     (error)=>{
                        console.log('Failure - Sub-Process Details Verification with name from grid Unsuccessful')
                    }
                );

                 //status change code
                 console.log('\n3. Sub-Process Status:')
                 await page.waitForTimeout(1000);
                 await page.locator('[placeholder="Search keyword"]').fill(updatedProcessName);
                 await expect(page.locator('[row-index="0"]').first().locator('[col-id="name"] a')).toContainText(updatedProcessName).then(
                     async (onfulfilled)=>{
                         await page.locator('[row-index="0"]').last().click();
                            await page.locator('[role="menu"] [aria-label="Set as Inactive"]').click();
                            await expect(page.locator('p-toastitem')).toBeAttached().then(
                                async (onfulfilled) => {
                                    await page.locator('.p-toast-summary').textContent().then(
                                        async (message) => {
                                            if (message.trim() == 'Error') {
                                                console.log('Failure - Sub-Process Status Not Updated '  )
                                            }
                                            else {
                                                 await page.waitForTimeout(1000);
                                                 const isUnpublished=await page.locator('[row-index="0"]').first().locator('[status="Unpublished"]').isVisible();
                                                 const isInactive=await page.locator('[row-index="0"]').first().locator('[status="Inactive"]').isVisible();
                                                 const isNew=await page.locator('[row-index="0"]').first().locator('[status="New"]').isVisible();
                                                 if(isInactive && isNew && isUnpublished){
                                                     console.log('Success - Sub-Process Status Updated Successfully '  )
                                                 }                                           
                                             }
                                        },
                                        (error) => {
                                            console.log('Failure - Sub-Process Not Status Not Updated')
                                        }
                                    )
                                },
                                (error) => {
                                    console.log('Failure - Sub-Process Not Deleted')
                                }
                            );
                     },
                     (error)=>{
                         console.log('Failure - Sub-Process Status Not Updated  Sub-Process does not exist')
                     }
                 );

                //delete prcoess
                   console.log('\n4. Sub-Process Delete:');
                   await page.waitForTimeout(1000);
                   await page.locator('[placeholder="Search keyword"]').fill(updatedProcessName);
                   await expect(page.locator('[row-index="0"]').first().locator('[col-id="name"] a')).toContainText(updatedProcessName).then(
                       async (onfulfilled) => {
                           await page.locator('[row-index="0"]').last().click();
                           await page.locator('[role="menu"] [aria-label="Delete"]').click();
                           await expect(page.locator('p-toastitem')).toBeAttached().then(
                               async (onfulfilled) => {
                                   await page.locator('.p-toast-summary').textContent().then(
                                       async (message) => {
                                           if (message.trim() == 'Error') {
                                               console.log('Failure - Sub-Process Not Deleted '  )
                                           }
                                           else {
                                               console.log('Success - Sub-Process Deleted Successfully '  )
                                           }
                                       },
                                       (error) => {
                                           console.log('Failure - Sub-Process Not Deleted')
                                       }
                                   )
                               },
                               (error) => {
                                   console.log('Failure - Sub-Process Not Deleted')
                               }
                           );
                       },
                       async (error) => {
                           console.log('Failure - Sub-Process Not Deleted  Sub-Process does not exist')
                       }
                   );

               

            },
            async (error)=>{
                console.log('Failure on opening sub-process library ' );               
            }
           );

            //code for workflow
           console.log('\n\nWorkflow Library Flow is as below:\n')
           await page.locator('a[role="tab"]').nth(0).click();
           await expect(page.locator('p-toastitem')).not.toBeAttached().then(
                async (onfulfilled)=>{
                    //workflow creation code
                    console.log('1. Workflow creation: ')
                    await page.locator('[label="Add Workflow"]').click();
                    const testWorkflowName='demo'+Math.floor(Math.random()*1000);
                    const testCaseType='Eviction';
                    const testState='VI';
                    const testDescription='test description';
                    await page.locator('#name').fill(testWorkflowName);
                    await page.locator('[formcontrolname="caseType"]').click();
                    await page.locator('.p-dropdown-filter').fill(testCaseType);
                    await page.locator('.p-dropdown-item').first().click();
                    await page.locator('[formcontrolname="state"]').click();
                    await page.locator('[formcontrolname="state"] .p-dropdown-filter').fill(testState);
                    await page.locator('.p-dropdown-item').first().click();
                    await page.locator('[formcontrolname="description"]').fill(testDescription);
                    await page.locator('[label="Submit"]').click();
                    await expect(page.locator('p-toastitem')).toBeAttached().then(
                        async (onfulfilled) => {
                            await page.locator('.p-toast-summary').textContent().then(
                                async (message) => {
                                    if (message.trim() == 'Error') {
                                        console.log('Failure - Workflow Not Created '  )
                                    }
                                    else {
                                        console.log('Success - Workflow Created Successfully '  )
                                    }
                                },
                                (error) => {

                                }
                            )
                        },
                        (error) => {
                            console.log('Failure - Workflow Not Created')
                        }
                    );
                    
                    //verify workflow creation code
                    console.log('\nWorkflow Details Verifying after Workflow Creation:')
                    await page.locator('[placeholder="Search keyword"]').fill(testWorkflowName);
                    await expect(page.locator('[row-index="0"]').first().locator('[col-id="name"] a')).toContainText(testWorkflowName).then(
                        async (onfulfilled)=>{
                            const searchedCaseType=await page.locator('[row-index="0"]').first().locator('[col-id="customProperties.caseType"]').textContent();
                            if(searchedCaseType.trim()==testCaseType){
                                const isUnpublished=await page.locator('[row-index="0"]').first().locator('[status="Unpublished"]').isVisible();
                                const isActive=await page.locator('[row-index="0"]').first().locator('[status="Active"]').isVisible();
                                const isNew=await page.locator('[row-index="0"]').first().locator('[status="New"]').isVisible();
                                if(isActive && isNew && isUnpublished){
                                    const searchedState=await page.locator('[row-index="0"]').first().locator('[col-id="customProperties.state"]').textContent();
                                    if(searchedState.trim()==testState){
                                        await expect(page.locator('[row-index="0"]').first().locator('[col-id="customProperties.description"]')).toContainText(testDescription).then(
                                            (onfulfilled)=>{
                                                console.log('Success - Workflow Details Verified from Grid');
                                            },
                                            (error)=>{
                                                console.log('Failure - Workflow Details Verification with description from grid Unsuccessful')
                                            }
                                        );
                                    }
                                    else{
                                        console.log('Failure - Workflow Details Verification with state from grid Unsuccessful')
                                    }
                                }
                                else{
                                    console.log('Failure - Workflow Details Verification with status from grid Unsuccessful');
                                }
                            }
                            else{
                                console.log('Failure - Workflow Details Verification with case from grid Unsuccessful');
                            }
                        },
                        async (error)=>{
                            console.log('Failure - Workflow Details Verification with name from grid Unsuccessful')
                        }
                    );

                    
                    //update workflow library code
                    console.log('\n2. Workflow Edit:');
                    const updatedWorkflowName='demo'+Math.floor(Math.random()*1000);
                    const updatedCaseType='Bankruptcy';
                    const updatedState='FL';
                    const updatedDescription='updated test description';
                    await page.locator('[placeholder="Search keyword"]').fill(testWorkflowName);
                    await expect(page.locator('[row-index="0"]').first().locator('[col-id="name"] a')).toContainText(testWorkflowName).then(
                        async (onfulfilled)=>{
                            await page.locator('[row-index="0"]').last().click();
                            await page.locator('[aria-label="Edit"]').click();
                            await page.waitForTimeout(1000);
                            await page.locator('#name').clear();
                            await page.locator('#name').fill(updatedWorkflowName);
                            await page.locator('[formcontrolname="caseType"]').click();
                            await page.locator('[formcontrolname="caseType"] .p-dropdown-filter').fill(updatedCaseType);
                            await page.locator('.p-dropdown-item').first().click();
                            await page.locator('[formcontrolname="state"]').click();
                            await page.locator('[formcontrolname="state"] .p-dropdown-filter').fill(updatedState);
                            await page.locator('.p-dropdown-item').first().click();
                            await page.locator('[formcontrolname="description"]').fill(updatedDescription);
                            await page.locator('[label="Submit"]').click();
                            await expect(page.locator('p-toastitem')).toBeAttached().then(
                                async (onfulfilled) => {
                                    await page.locator('.p-toast-summary').textContent().then(
                                        async (message) => {
                                            if (message.trim() == 'Error') {
                                                console.log('Failure - Workflow Not Updated '  )
                                            }
                                            else {
                                                console.log('Success - Workflow Updated Successfully '  )
                                            }
                                        },
                                        (error) => {
        
                                        }
                                    )
                                },
                                (error) => {
                                    console.log('Failure - Workflow Not Updated')
                                }
                            );
                        },
                         (error)=>{
                            console.log('Failure - Step Not Updated Workflow does not exist')
                        }
                    );
                    

                    //verify after updation
                    console.log('\nWorkflow Details Verifying after Workflow Edit:')
                    await page.locator('[placeholder="Search keyword"]').fill(updatedWorkflowName);
                    await expect(page.locator('[row-index="0"]').first().locator('[col-id="name"] a')).toContainText(updatedWorkflowName).then(
                        async (onfulfilled)=>{
                            const searchedCaseType=await page.locator('[row-index="0"]').first().locator('[col-id="customProperties.caseType"]').textContent();
                            if(searchedCaseType.trim()==updatedCaseType){
                                const isUnpublished=await page.locator('[row-index="0"]').first().locator('[status="Unpublished"]').isVisible();
                                const isActive=await page.locator('[row-index="0"]').first().locator('[status="Active"]').isVisible();
                                const isNew=await page.locator('[row-index="0"]').first().locator('[status="New"]').isVisible();
                                if(isActive && isNew && isUnpublished){
                                    const searchedState=await page.locator('[row-index="0"]').first().locator('[col-id="customProperties.state"]').textContent();
                                    if(searchedState.trim()==updatedState){
                                        await expect(page.locator('[row-index="0"]').first().locator('[col-id="customProperties.description"]')).toContainText(updatedDescription).then(
                                            (onfulfilled)=>{
                                                console.log('Success - Workflow Details Verified from Grid');
                                            },
                                            (error)=>{
                                                console.log('Failure - Workflow Details Verification with description from grid Unsuccessful')
                                            }
                                        );
                                    }
                                    else{
                                        console.log('Failure - Workflow Details Verification with state from grid Unsuccessful')
                                    }
                                }
                                else{
                                    console.log('Failure - Workflow Details Verification with status from grid Unsuccessful');
                                }
                            }
                            else{
                                console.log('Failure - Workflow Details Verification with case from grid Unsuccessful');
                            }
                        },
                        async (error)=>{
                            console.log('Failure - Workflow Details Verification with name from grid Unsuccessful')
                        }
                    );

                    //workflow status change
                    console.log('\n3. Workflow Status:')
                    await page.waitForTimeout(1000);
                    await page.locator('[placeholder="Search keyword"]').fill(updatedWorkflowName);
                    await expect(page.locator('[row-index="0"]').first().locator('[col-id="name"] a')).toContainText(updatedWorkflowName).then(
                        async (onfulfilled) => {
                            await page.locator('[row-index="0"]').last().click();
                            await page.locator('[role="menu"] [aria-label="Set as Inactive"]').click();
                            await expect(page.locator('p-toastitem')).toBeAttached().then(
                                async (onfulfilled) => {
                                    await page.locator('.p-toast-summary').textContent().then(
                                        async (message) => {
                                            if (message.trim() == 'Error') {
                                                console.log('Failure - Process Status Not Updated '  )
                                            }
                                            else {
                                                await page.waitForTimeout(1000);
                                                const isUnpublished=await page.locator('[row-index="0"]').first().locator('[status="Unpublished"]').isVisible();
                                                const isInactive=await page.locator('[row-index="0"]').first().locator('[status="Inactive"]').isVisible();
                                                const isNew=await page.locator('[row-index="0"]').first().locator('[status="New"]').isVisible();
                                                if(isInactive && isNew && isUnpublished){
                                                    console.log('Success - Process Status Updated Successfully '  )
                                                }
                                            }
                                        },
                                        (error) => {
                                            console.log('Failure - Process Not Status Not Updated')
                                        }
                                    )
                                },
                                (error) => {
                                    console.log('Failure - Process Not Deleted')
                                }
                            );
                        },
                        (error) => {
                            console.log('Failure - Process Status Not Updated  Process does not exist')
                        }
                    );

                    //delete workflow library
                    console.log('\n4. Workflow Delete:')
                    await page.waitForTimeout(1000);
                    await page.locator('[placeholder="Search keyword"]').fill(updatedWorkflowName);
                    await expect(page.locator('[row-index="0"]').first().locator('[col-id="name"] a')).toContainText(updatedWorkflowName).then(
                        async (onfulfilled) => {
                            await page.locator('[row-index="0"]').last().click();
                            await page.locator('[role="menu"] [aria-label="Delete"]').click();
                            await expect(page.locator('p-toastitem')).toBeAttached().then(
                                async (onfulfilled) => {
                                    await page.locator('.p-toast-summary').textContent().then(
                                        async (message) => {
                                            if (message.trim() == 'Error') {
                                                console.log('Failure - Workflow Not Deleted '  )
                                            }
                                            else {
                                                console.log('Success - Workflow Deleted Successfully '  )
                                            }
                                        },
                                        (error) => {
                                            console.log('Failure - Workflow Not Deleted')
                                        }
                                    )
                                },
                                (error) => {
                                    console.log('Failure - Workflow Not Deleted')
                                }
                            );
                        },
                        async (error) => {
                            console.log('Failure - Workflow Not Deleted  Process does not exist')
                        }
                    );

                    
                    


                },
                async (error)=>{
                    console.log('Failure on opening workflow library ' );               
                }
           );
            
            
        },async (error)=>{
            console.log('Failure on opening workflow component ' );               
        }
    );
    
    await page.locator('[aria-label="viaWorks"]').click();
    //code for viaWorks designer
    console.log('\n\nviaWorks Designer Flow is as below:\n')
    const [newPage]=await Promise.all([
         context.waitForEvent('page'),
         page.locator('[aria-label="viaWorks Designer"]').click()
    ]);
    // await loginInNewTab(newPage);
    if(newPage.url().includes('https://dev-via.outamationlabs.com/via-works-ui/')){
        console.log('new tab open')
        const Header = await newPage.waitForSelector("div > h2");
    if (Header.isVisible()) {
      console.log("ViaWorks Header Displayed Success");
      await page.waitForTimeout(4000);
      await newPage
        .locator("div.mud-input-control-input-container > div > input")
        .first()
        .fill("admin");
      await newPage
        .locator("div.mud-input-control-input-container > div > input")
        .nth(1)
        .fill("password");
      await newPage.locator("button[type='submit']").click();
 
      await page.waitForTimeout(5000);
      const Dashboardpageheader = await (
        await newPage.waitForSelector("div > h5")
      ).innerText();
 
      if (Dashboardpageheader.includes("Dashboard")) {
        console.log("Success: Dashboard page loaded successfully");
      } else {
        console.log("Failure: Dashboard page not loaded");
      }
      await newPage.locator('.mud-nav-item').nth(1).click();
      var url=await newPage.url();
      if(url.includes('workflows/definitions')){
        console.log("Success: Workflows page loaded successfully");
      }
      else{
        console.log("Failure: Workflows page not loaded");
      }
      await newPage.locator('.mud-nav-item').nth(2).click();
       url=await newPage.url();
      if(url.includes('sub-processes/definitions')){
        console.log("Success: Sub-Process page loaded successfully");
      }
      else{
        console.log("Failure: Sub-Process page not loaded");
      }
    } else {
      console.log("ViaWorks Header Displayed Failure");
    }
    }
    else{
        console.log('new tab failed to open')
    }


    //code for variable list flow:
    console.log('\n\nVariable List Flow is as below:')
    await page.locator('[aria-label="Variable Library"]').click();
    await expect(page.locator('p-toastitem')).not.toBeAttached().then(
        async (onfulfilled)=>{
            console.log('\n1. Variable Creation:')
            await page.locator('[label="Add Variable"]').click();
            const testVariableName = 'demo';
            const testDesc = 'test description';
            await page.locator('#name').fill(testVariableName);
            await page.locator('#description').fill(testDesc);
            await page.waitForTimeout(3000);
            // let query=await page.locator('.mtk1').textContent();
            // query=query.concat('.caseType');
            // console.log(query);
            // await page.pause();
            // await page.evaluate((query)=>{
            //    const span=document.getElementsByClassName('mtk1');
            //    span.textContent=query; 
            // })
            await page.locator('.mtk1').click();
            await page.keyboard.press('ArrowRight');
            await page.keyboard.press('ArrowRight');
            await page.keyboard.press('ArrowRight');
            await page.keyboard.press('ArrowRight');
            await page.keyboard.type('.c');
            await page.waitForTimeout(3000);
            await page.keyboard.press('Enter');
            await page.locator('[label="Test"]').click();
            await expect(page.locator('pre')).not.toContainText('NA').then(
                async (onfulfilled) => {
                    await page.locator('[label="Save"]').click();
                },
                (error) => {
                    console.lof('Failure - ')
                }
            );
            await expect(page.locator('p-toastitem')).toBeAttached().then(
                async (onfulfilled) => {
                    await page.locator('.p-toast-summary').textContent().then(
                        async (message) => {
                            if (message.trim() == 'Error') {
                                console.log('Failure - Variable Not Created ')
                            }
                            else {
                                console.log('Success - Variable Created Successfully ')
                            }
                        },
                        (error) => {
                            console.lof('Failure - ')

                        }
                    )
                },
                (error) => {
                    console.log('Failure - Variable Not Created')
                }
            );
            //verify created variable
            console.log('\nVariable Details Verifying after Variable Creation:')
            await page.locator('[placeholder="Search keyword"]').fill(testVariableName);
            await expect(page.locator('[row-index="0"]').first().locator('[col-id="name"]')).toContainText(testVariableName).then(
                async (onfulfilled) => {
                    const searchedDesc = await page.locator('[row-index="0"]').first().locator('[col-id="description"]').textContent();
                    if (searchedDesc.trim() == testDesc) {
                        const exp = await page.locator('[row-index="0"]').first().locator('[col-id="expr"]').textContent();
                        if (exp.trim() == 'viaCase.caseType') {
                            console.log('Success - Variable Details Verified from Grid')
                        }
                        else {
                            console.log('Failure - Variable Details Verification from grid Unsuccessful for Expression')
                        }
                    }
                    else {
                        console.log('Failure - Variable Details Verification from grid Unsuccessful for Description')
                    }
                },
                (error) => {
                    console.log('Failure - Variable Details Verification from grid Unsuccessful for name')
                }
            );


            //
            console.log('\n2. Variable Edit:')
            // const testVariableName='demo';
            const updatedName = 'test';
            const updatedDesc = 'updated description';
            await page.locator('[placeholder="Search keyword"]').fill(testVariableName);
            await expect(page.locator('[row-index="0"]').first().locator('[col-id="name"]')).toContainText(testVariableName).then(
                async (onfulfilled) => {
                    await page.locator('[row-index="0"]').last().click();
                    await page.locator('[aria-label="Edit"]').click();
                    await page.waitForTimeout(2000);
                    // let query=await page.locator('.mtk1').textContent();
                    // query=query.concat('.caseType');
                    await page.locator('#description').fill(updatedDesc);
                    await page.locator('#name').fill(updatedName);
                    await page.locator('.mtk1').click();
                    await page.keyboard.press('Control+Shift+ArrowRight+Backspace');
                    await page.keyboard.type('a');
                    await page.waitForTimeout(3000);
                    await page.keyboard.press('Enter');
                    await page.locator('[label="Test"]').click();
                    await expect(page.locator('pre')).not.toContainText('NA').then(
                        async (onfulfilled) => {
                            await page.locator('[label="Save"]').click();
                        },
                        (error) => {
                            console.lof('Failure - ')
                        }
                    );
                    await expect(page.locator('p-toastitem')).toBeAttached().then(
                        async (onfulfilled) => {
                            await page.locator('.p-toast-summary').textContent().then(
                                async (message) => {
                                    if (message.trim() == 'Error') {
                                        console.log('Failure - Variable Not Updated ')
                                    }
                                    else {
                                        console.log('Success - Variable Updated Successfully ')
                                    }
                                },
                                (error) => {
                                    console.lof('Failure - ')

                                }
                            )
                        },
                        (error) => {
                            console.log('Failure - Variable Not Updated')
                        }
                    );
                },
                (error) => {
                    console.log('Failure - Variable not exist')
                }
            );

            //verify after edit
            console.log('\nVariable Details Verifying after Variable Edit:')
            await page.locator('[placeholder="Search keyword"]').fill(updatedName);
            await expect(page.locator('[row-index="0"]').first().locator('[col-id="name"]')).toContainText(updatedName).then(
                async (onfulfilled) => {
                    const searchedDesc = await page.locator('[row-index="0"]').first().locator('[col-id="description"]').textContent();
                    if (searchedDesc.trim() == updatedDesc) {
                        const exp = await page.locator('[row-index="0"]').first().locator('[col-id="expr"]').textContent();
                        if (exp.trim() == 'viaCase.action') {
                            console.log('Success - Variable Details Verified from Grid')
                        }
                        else {
                            console.log('Failure - Variable Details Verification from grid Unsuccessful for Expression')
                        }
                    }
                    else {
                        console.log('Failure - Variable Details Verification from grid Unsuccessful for Description')
                    }
                },
                (error) => {
                    console.log('Failure - Variable Details Verification from grid Unsuccessful for name')
                }
            );

            //code for delete variable
            console.log('\n3. Variable Delete:')
            await page.locator('[placeholder="Search keyword"]').fill(updatedName);
            await expect(page.locator('[row-index="0"]').first().locator('[col-id="name"]')).toContainText(updatedName).then(
                async (onfulfilled) => {
                    await page.locator('[row-index="0"]').last().click();
                    await page.locator('[aria-label="Delete"]').click();
                    await expect(page.locator('p-toastitem')).toBeAttached().then(
                        async (onfulfilled) => {
                            await page.locator('.p-toast-summary').textContent().then(
                                async (message) => {
                                    if (message.trim() == 'Error') {
                                        console.log('Failure - Variable Not Deleted ')
                                    }
                                    else {
                                        console.log('Success - Variable Deleted Successfully ')
                                    }
                                },
                                (error) => {
                                    console.lof('Failure - ')

                                }
                            )
                        },
                        (error) => {
                            console.log('Failure - Variable Not Deleted')
                        }
                    );
                },
                (error) => {
                    console.log('Failure - Variable not exist')
                }
            );
        },
        (error)=>{
            console.log('Failure on opening Variable List ' );               
        }
    );
})


test('Advance Search',async({browser})=>{
    const context=await browser.newContext({storageState:'via.json'});
    const page=await context.newPage();
    await page.goto('https://dev-via.outamationlabs.com/');
    await page.locator('[aria-label="Advance Search"]').click();
    await expect(page.locator('p-toastitem')).not.toBeAttached().then(
        async (onfulfilled)=>{
            await page.locator('via-grid-link').first().waitFor();
            await page.locator('[placeholder="Search keyword"]').fill('0000089FC01');
            await page.waitForTimeout(2000);
            const cases = page.locator('via-grid-link');
            const caseCount = await cases.count();
            let i = 0;
            await cases.nth(i).click();
            await page.locator('tr[aria-level="1"]').first().waitFor();
            const subProcess = page.locator('tr[aria-level="1"]');
            const subProcessCount = await subProcess.count();
            console.log('Total sub-process in case: ' + subProcessCount)
            for (let j = 0; j < subProcessCount; j++) {
                if (!await subProcess.nth(j).locator('[status="Completed"]').isVisible()) {
                    await subProcess.nth(j).click();
                    await page.locator('tr[aria-level="2"]').first().waitFor();
                    const steps = page.locator('tr[aria-level="2"]');
                    const stepCount = await steps.count();
                    console.log('Total steps in sub-process: ' + stepCount);
                    for (let s = 0; s < stepCount; s++) {
                        if (!await steps.nth(s).locator('[status="Completed"]').isVisible()) {
                            await steps.nth(s).click();
                            await page.locator('[aria-label="dropdown trigger"]').last().click();
                            await page.locator('div[trigger="true"]').click();
                            await page.waitForTimeout(2000);
                            await page.locator('[ng-reflect-label="Submit"]').click();
                            await page.waitForTimeout(3000);
                            if (s < stepCount - 1)
                                await subProcess.nth(j).click();
                        }
                    }
                }
                if (await subProcess.nth(j).locator('[status="Completed"]').isVisible()) {
                    console.log('Success - Sub Process ' + j + ' completed')
                }
                else {
                    console.log('Failure - Sub Process ' + j + ' not completed')
                }
            }
            if (await page.locator('div.grid').getByText('Completed').isVisible()) {
                var tmp = i + 1;
                console.log('Success - Case completed')
            }
        },
        (error)=>{
            console.log('Failure on advance search page');
        }
    );
})