# The CW attack algorithm

> The Carlini & Wagner attack is currently one of the best known algorithms to generate adversarial examples.

- [Brief introduction](#brief-introduction)
- [Original CW attack algorithm](#original-cw-attack-algorithm)
- [Constructing the function $f$](#constructing-the-function-f)
- [Formulating the loss function](#formulating-the-loss-function)
- [Solving the last constraint](#solving-the-last-constraint)
- [References](#references)

## Brief introduction

The CW attack algorithm is a very typical adversarial attack, which utilizes two separate losses:

- An adversarial loss to make the generated image actually adversarial, i.e., is capable of fooling image classifiers.
- An image distance loss to constraint the quality of the adversarial examples so as not to make the perturbation too obvious to the naked eye.

This paradigm makes CW attack and its variants capable of being integrated with many other image quality metrics like the PSNR or the SSIM - [[iqa]].

## Original CW attack algorithm

When adversarial examples were first discovered in 2013, the optimization problem to craft adversarial examples was formulated as:

$$\begin{aligned}\text{minimize}:&\ \mathcal{D}(x,x+\delta)\\ \text{such that}:&\ \mathcal{C}(x+\delta)=t&&\text{Constraint 1}\\&\ x+\delta\in[0,1]^n&&\text{Constraint 2}\end{aligned}$$

Where:

- $x$ is the input image, $\delta$ is the perturbation, $n$ is the dimension of the image and $t$ is the target class.
- Function $\mathcal{D}$ serves as the distance metric between the adversarial and the real image, and function $\mathcal{C}$ is the classifier function.

Traditionally well known ways to solve this optimization problem is to define an objective function and to perform gradient descent on it, which will eventually guide us to an optimal point in the function. However, the formula above is difficult to solve because $\mathcal{C}(x+\delta)=t$ is highly non-linear (the classifier is not a straight forward linear function).

In CW, we express Constraint 1 in a different form as an objective function $f$ such that when $\mathcal{C}(x+\delta)=t$ is satisfied, $f(x+\delta) \leq t$ is also satisfied.

## Constructing the function $f$

Conceptually, the objective function tells us how close we are getting to being classified as $t$. One simple but not a very good choice for function $f$ is:

$$f(x+\delta)=[1-\mathcal{C}[x+\delta]_T]$$

Where $C[x+\delta]_T$ is the probability of $x+\delta$ being classified as $t$. If the probability is low, then the value of $f$ is closer to 1 whereas when it is classified as $t$, $f$ is equal to 0. This is how the objective function works, but clearly we can't use this in real world implementations.

In the original paper, seven different objective functions are assessed, and the best among them is given by:

$$f(x')=\max(\max\{Z(x')_i:i\neq t\}-Z(x')_t, -k)$$

Where:
- $Z(x')$ is the logit (the unnormalized raw probability predictions of the model for each class / a vector of probabilities) when the input is an adversarial $x'$.
- $\max{Z(x')_i:i\neq t}$ is the probability of the target class (which represents how confident the model is on misclassifying the adversarial as the target).
- So, $\max{Z(x')_i:i\neq t}-Z(x')_t$ is the difference between what the model thinks the current image most probably is and what we want it to think.

The above term is essentially the difference of two probability values, so when we specify another term $-k$ and take a max, we are setting a lower limit on the value of loss. Hence, by controlling the parameter $-k$ we can specify how confident we want our adversarial to be classified as.

## Formulating the loss function

We then reformulates the original optimization problem by moving the difficult of the given constraints into the minimization function.

$$\begin{aligned}\text{minimize}:&\ \mathcal{D}(x,x+\delta)+c\cdot f(x+\delta)\\ \text{such that}:&\ x+\delta\in [0,1]^n&&\text{Constraint 2}\end{aligned}$$

Here we introduce a constant $c$ to formulate our final loss function, and by doing so we are left with only one of the prior two constraints. Constant $c$ is best found by doing a binary search, where the most often lower bound is $1\times 10^{-4}$ and the upper bound is $+\infty$.

:::success The best constant
I personally found that the best constant is often found lying between 1 or 2 through my personal experiments.
:::

## Solving the last constraint

After formulating our final loss function, we are presented with this final constraint:

$$x+\delta\in[0,1]^n$$

This constraint is expressed in this particular form known as the "box constraint", which means that there is an upper bound and a lower bound set to this constraint. In order to solve this, we will need to apply a method called "change of variable", in which we optimize over $w$ instead of the original variable $\delta$, where $w$ is given by:

$$\begin{aligned}\delta &= \frac{1}{2}\cdot (\tanh(w)+1)-x\\ \text{or,}\quad x+\delta&= \frac{1}{2}\cdot (\tanh(w)+1)&&\text{Constraint 2}\end{aligned}$$

Where $\tanh$ is the hyperbolic tangent function, so when $\tanh(W)$ varies from -1 to 1, $x+\delta$ varies from 0 to 1.

Therefore, our final optimization problem is:

$$\begin{aligned}\text{minimize}:&\ \mathcal{D}\left(\frac{1}{2}\cdot (\tanh(w)+1), x\right)+c\cdot f\left(\frac{1}{2}\cdot (\tanh(w)+1)\right)\\ \text{such that}:&\ \tanh(w)\in [-1,1]\\ \text{where}:&\ f(x')=\max(\max\{Z(x')_i:i\neq t\}-Z(x')_t, -k)\end{aligned}$$

The CW attack is the solution to the optimization problem (optimized over $w$) given above using Adam optimizer. To avoid gradient descent getting stuck, we use multiple starting point gradient descent in the solver.

## References

- [Medium - Explaining the Carlini & Wagner Attack Algorithm to Generate Adversarial Examples.](https://medium.com/@iambibek/explanation-of-the-carlini-wagner-c-w-attack-algorithm-to-generate-adversarial-examples-6c1db8669fa2)

[//begin]: # "Autogenerated link references for markdown compatibility"
[iqa]: iqa.md "Image Quality Assessment"
[//end]: # "Autogenerated link references"
