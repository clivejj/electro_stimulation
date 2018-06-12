# N-Body Electrostatic Force Problem

This is a simulation of the N-Body Problem for charged particles. The user interacts with this simulation by clicking somehwere within the rectangle on the screen. Then, a box will appear in the lower lefthand corner. The user should enter a value [-100, 100] representing the charge of the particle. The charge of the particle is represented by the color and opacity of the circle. Then the user hits 'submit' to save the particle. The user can continue placing particles on the screen. When they are done, the user should click 'start'. This will start the simulation, which can be paused at any time. The simulation will end when there are no more particles left, or when all particles are off the screen, or when the user clicks 'clear'. 

Note that particles can be added while the simulation is still running. 

Note that if a user only places particles of very small charge (like +1, or -1), it might appear as if the particles are not moving. This is just because the forces at play are very small if the charges are very small. If the user waits for a few seconds, they will begin to notice visible movement amongst the particles. 

To simplify this model, particles that collide with each other will annihilate each other. This does not necessarily happen in nature, but it serves to simplify the simulation. Another simplification made in this simulation is that all particles have the same mass. 

### The simulation is hosted [here](https://clivejj.github.io/)
